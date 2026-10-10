// Row Level Security + role tests. Run with: npm run test:sql
import { start, migrate, as } from "./harness.mjs";

let pass = 0,
  fail = 0;
const t = async (name, fn) => {
  try {
    await fn();
    pass++;
    console.log("  ok   ", name);
  } catch (e) {
    fail++;
    console.log("  FAIL ", name, "->", e.message);
  }
};
const expect = (cond, msg) => {
  if (!cond) throw new Error(msg);
};
const denied = (r, why) =>
  expect(
    !r.ok || r.rowCount === 0,
    `${why}: expected denial but got ${JSON.stringify(r).slice(0, 160)}`,
  );
const allowed = (r, why) => expect(r.ok, `${why}: ${r.error}`);

const { server, admin } = await start();
try {
  console.log("applying migrations");
  await migrate(admin);

  const ids = {};
  for (const [k, email] of [
    ["super", "s@x.dev"],
    ["admin", "a@x.dev"],
    ["inactive", "i@x.dev"],
    ["plain", "p@x.dev"],
    ["admin2", "a2@x.dev"],
  ]) {
    ids[k] = (
      await admin.query("insert into auth.users (email) values ($1) returning id", [email])
    ).rows[0].id;
  }
  await admin.query(
    `insert into admin_profiles (user_id,name,email,role,status) values
    ($1,'Super','s@x.dev','super_admin','active'), ($2,'Admin','a@x.dev','admin','active'),
    ($3,'Gone','i@x.dev','admin','inactive'), ($4,'Admin2','a2@x.dev','admin','active')`,
    [ids.super, ids.admin, ids.inactive, ids.admin2],
  );
  await admin.query(
    `update site_content set data = '{"tracking":{"customHeadScript":"","customBodyScript":""},"hello":"live"}' where id='public'`,
  );

  console.log("site_content visibility");
  await t("anon reads the live row", async () => {
    const r = await as(admin, "anon", "", "select id from site_content");
    allowed(r, "anon select");
    expect(
      r.rows.length === 1 && r.rows[0].id === "public",
      "anon must see only public: " + JSON.stringify(r.rows),
    );
  });
  await t("plain signed-in user sees only live row", async () => {
    const r = await as(admin, "authenticated", ids.plain, "select id from site_content");
    expect(r.rows.map((x) => x.id).join() === "public", JSON.stringify(r.rows));
  });
  await t("inactive admin sees only live row", async () => {
    const r = await as(admin, "authenticated", ids.inactive, "select id from site_content");
    expect(r.rows.map((x) => x.id).join() === "public", JSON.stringify(r.rows));
  });
  await t("admin sees public+draft but NOT private", async () => {
    const r = await as(
      admin,
      "authenticated",
      ids.admin,
      "select id from site_content order by id",
    );
    expect(r.rows.map((x) => x.id).join() === "draft,public", JSON.stringify(r.rows));
  });
  await t("super admin sees all three", async () => {
    const r = await as(
      admin,
      "authenticated",
      ids.super,
      "select id from site_content order by id",
    );
    expect(r.rows.map((x) => x.id).join() === "draft,private,public", JSON.stringify(r.rows));
  });

  console.log("site_content writes");
  await t("anon cannot write anything", async () => {
    denied(
      await as(admin, "anon", "", "update site_content set data='{}' where id='public'"),
      "anon update",
    );
  });
  await t("admin cannot write the LIVE row directly", async () => {
    denied(
      await as(
        admin,
        "authenticated",
        ids.admin,
        "update site_content set data='{\"x\":1}' where id='public'",
      ),
      "admin update public",
    );
  });
  await t("admin cannot insert a second live row / rewrite via insert", async () => {
    denied(
      await as(
        admin,
        "authenticated",
        ids.admin,
        "insert into site_content (id,data) values ('public','{}') on conflict (id) do update set data=excluded.data",
      ),
      "admin upsert public",
    );
  });
  await t("admin CAN write the draft", async () => {
    const r = await as(
      admin,
      "authenticated",
      ids.admin,
      `update site_content set data='{"tracking":{"customHeadScript":"","customBodyScript":""},"hello":"draft"}' where id='draft'`,
    );
    allowed(r, "admin draft update");
    expect(r.rowCount === 1, "no row updated");
  });
  await t("admin cannot touch private (SMTP) row", async () => {
    denied(
      await as(
        admin,
        "authenticated",
        ids.admin,
        "update site_content set data='{\"smtp\":{}}' where id='private'",
      ),
      "admin private update",
    );
  });
  await t("super admin can write private row", async () => {
    const r = await as(
      admin,
      "authenticated",
      ids.super,
      'update site_content set data=\'{"smtp":{"smtpHost":"h"}}\' where id=\'private\'',
    );
    allowed(r, "super private");
    expect(r.rowCount === 1, "not updated");
  });
  await t("inactive admin cannot write draft", async () => {
    denied(
      await as(
        admin,
        "authenticated",
        ids.inactive,
        "update site_content set data='{\"y\":1}' where id='draft'",
      ),
      "inactive write",
    );
  });
  await t("draft write with stale updated_at matches 0 rows (conflict detection)", async () => {
    const r = await as(
      admin,
      "authenticated",
      ids.admin,
      `update site_content set data='{"z":1}' where id='draft' and updated_at = '2000-01-01T00:00:00Z'`,
    );
    expect(r.ok && r.rowCount === 0, "stale write must match nothing");
  });

  console.log("custom script gating");
  const withScript = `{"tracking":{"customHeadScript":"<script>alert(1)</script>","customBodyScript":""}}`;
  await t("admin cannot add a custom script to the draft", async () => {
    const r = await as(
      admin,
      "authenticated",
      ids.admin,
      `update site_content set data='${withScript}' where id='draft'`,
    );
    expect(!r.ok && /Super Admin/.test(r.error), "should be rejected: " + JSON.stringify(r));
  });
  await t("super admin can add a custom script to the draft", async () => {
    const r = await as(
      admin,
      "authenticated",
      ids.super,
      `update site_content set data='${withScript}' where id='draft'`,
    );
    allowed(r, "super adds script");
  });
  await t("a regular admin can publish a draft carrying a super admin's script", async () => {
    const r = await as(admin, "authenticated", ids.admin, "select publish_site('with script')");
    allowed(r, "admin publishes");
    const live = await admin.query(
      "select data->'tracking'->>'customHeadScript' s from site_content where id='public'",
    );
    expect(live.rows[0].s.includes("alert"), "script not live");
  });
  await t("after publish the draft is empty and a revision exists", async () => {
    const d = await admin.query("select data from site_content where id='draft'");
    expect(JSON.stringify(d.rows[0].data) === "{}", "draft not cleared");
    const r = await admin.query("select count(*)::int c from site_revisions");
    expect(r.rows[0].c === 1, "revision count " + r.rows[0].c);
  });
  await t("admin's first edit after publish keeping existing scripts is allowed", async () => {
    const r = await as(
      admin,
      "authenticated",
      ids.admin,
      `update site_content set data='{"tracking":{"customHeadScript":"<script>alert(1)</script>","customBodyScript":""},"edit":1}' where id='draft'`,
    );
    allowed(r, "edit after publish");
    expect(r.rowCount === 1, "no row");
  });
  await t("admin cannot remove/alter the script either", async () => {
    const r = await as(
      admin,
      "authenticated",
      ids.admin,
      `update site_content set data='{"tracking":{"customHeadScript":"","customBodyScript":""},"edit":2}' where id='draft'`,
    );
    expect(!r.ok, "script removal by non-super must fail");
  });

  console.log("publish / discard / restore");
  await t("anon cannot call publish_site", async () => {
    const r = await as(admin, "anon", "", "select publish_site()");
    expect(!r.ok, "anon must not publish");
  });
  await t("plain user cannot publish", async () => {
    const r = await as(admin, "authenticated", ids.plain, "select publish_site()");
    expect(!r.ok, "plain must not publish");
  });
  await t("publishing with an empty draft is refused", async () => {
    await admin.query("update site_content set data='{}' where id='draft'");
    const r = await as(admin, "authenticated", ids.admin, "select publish_site()");
    expect(!r.ok && /no unpublished/.test(r.error), JSON.stringify(r));
  });
  await t("discard_draft clears the draft", async () => {
    await admin.query(`update site_content set data='{"a":1}' where id='draft'`);
    allowed(await as(admin, "authenticated", ids.admin, "select discard_draft()"), "discard");
    const d = await admin.query("select data from site_content where id='draft'");
    expect(JSON.stringify(d.rows[0].data) === "{}", "not cleared");
  });
  await t("restore_revision loads an old version into the draft", async () => {
    const rev = (await admin.query("select id from site_revisions limit 1")).rows[0].id;
    allowed(
      await as(admin, "authenticated", ids.admin, "select restore_revision($1)", [rev]),
      "restore",
    );
    const d = await admin.query("select data from site_content where id='draft'");
    expect(JSON.stringify(d.rows[0].data).includes("customHeadScript"), "draft not restored");
  });
  await t("only 40 revisions are kept", async () => {
    for (let i = 0; i < 45; i++) {
      await admin.query(`insert into site_revisions (data) values ($1)`, [JSON.stringify({ i })]);
    }
    const r = await admin.query("select count(*)::int c from site_revisions");
    expect(r.rows[0].c === 40, "kept " + r.rows[0].c);
  });
  await t("admins can read revisions, anon cannot", async () => {
    expect(
      (await as(admin, "authenticated", ids.admin, "select count(*)::int c from site_revisions"))
        .rows[0].c === 40,
      "admin read",
    );
    expect(
      (await as(admin, "anon", "", "select * from site_revisions")).rows.length === 0,
      "anon read",
    );
  });
  await t("admins cannot insert/delete revisions directly", async () => {
    denied(
      await as(
        admin,
        "authenticated",
        ids.admin,
        "insert into site_revisions (data) values ('{}')",
      ),
      "rev insert",
    );
    denied(await as(admin, "authenticated", ids.admin, "delete from site_revisions"), "rev delete");
  });

  console.log("leads");
  const lead = `{"id":"l1","leadStage":"Inquiry","notes":[]}`;
  await t("anon can NO LONGER insert leads directly", async () => {
    denied(
      await as(admin, "anon", "", `insert into leads (id,data) values ('l1','${lead}')`),
      "anon lead insert",
    );
  });
  await t("service role inserts leads (server function path)", async () => {
    allowed(
      await as(admin, "service_role", "", `insert into leads (id,data) values ('l1','${lead}')`),
      "service insert",
    );
  });
  await t("anon cannot read leads", async () => {
    expect((await as(admin, "anon", "", "select * from leads")).rows.length === 0, "anon read");
  });
  await t("admin reads/updates/inserts/deletes leads", async () => {
    expect(
      (await as(admin, "authenticated", ids.admin, "select * from leads")).rows.length === 1,
      "admin read",
    );
    allowed(
      await as(
        admin,
        "authenticated",
        ids.admin,
        `insert into leads (id,data) values ('l2','${lead}')`,
      ),
      "admin insert",
    );
    expect(
      (
        await as(
          admin,
          "authenticated",
          ids.admin,
          `update leads set data = data || '{"city":"x"}' where id='l2'`,
        )
      ).rowCount === 1,
      "admin update",
    );
    expect(
      (await as(admin, "authenticated", ids.admin, "delete from leads where id='l2'")).rowCount ===
        1,
      "admin delete",
    );
  });
  await t("plain signed-in user cannot read or insert leads", async () => {
    expect(
      (await as(admin, "authenticated", ids.plain, "select * from leads")).rows.length === 0,
      "plain read",
    );
    denied(
      await as(
        admin,
        "authenticated",
        ids.plain,
        `insert into leads (id,data) values ('l3','${lead}')`,
      ),
      "plain insert",
    );
  });
  await t("lead_submissions is invisible to everyone but the service role", async () => {
    for (const [role, uid] of [
      ["anon", ""],
      ["authenticated", ids.admin],
      ["authenticated", ids.super],
    ]) {
      denied(
        await as(admin, role, uid, "insert into lead_submissions (ip_hash) values ('x')"),
        role + " insert",
      );
      expect(
        (await as(admin, role, uid, "select * from lead_submissions")).rows.length === 0,
        role + " read",
      );
    }
    allowed(
      await as(admin, "service_role", "", "insert into lead_submissions (ip_hash) values ('x')"),
      "service insert",
    );
  });

  console.log("admin_profiles");
  await t("admin cannot promote themselves or deactivate others", async () => {
    denied(
      await as(
        admin,
        "authenticated",
        ids.admin,
        `update admin_profiles set role='super_admin' where user_id='${ids.admin}'`,
      ),
      "self-promote",
    );
    denied(
      await as(
        admin,
        "authenticated",
        ids.admin,
        `update admin_profiles set status='inactive' where user_id='${ids.admin2}'`,
      ),
      "deactivate",
    );
  });
  await t("super admin can deactivate an admin", async () => {
    expect(
      (
        await as(
          admin,
          "authenticated",
          ids.super,
          `update admin_profiles set status='inactive' where user_id='${ids.admin2}'`,
        )
      ).rowCount === 1,
      "not updated",
    );
  });
  await t("deactivated admin immediately loses access", async () => {
    const r = await as(
      admin,
      "authenticated",
      ids.admin2,
      "select id from site_content order by id",
    );
    expect(r.rows.map((x) => x.id).join() === "public", JSON.stringify(r.rows));
  });
  await t("a signed-in user can read only their own profile if not an admin", async () => {
    expect(
      (await as(admin, "authenticated", ids.plain, "select * from admin_profiles")).rows.length ===
        0,
      "plain reads profiles",
    );
    expect(
      (await as(admin, "authenticated", ids.admin, "select * from admin_profiles")).rows.length ===
        4,
      "admin should see all",
    );
  });
  await t("admin can stamp own last_login via RPC only", async () => {
    allowed(await as(admin, "authenticated", ids.admin, "select touch_last_login()"), "touch");
    const r = await admin.query("select last_login from admin_profiles where user_id=$1", [
      ids.admin,
    ]);
    expect(r.rows[0].last_login, "not stamped");
  });

  console.log("activity log");
  await t("admin logs under their own id", async () => {
    allowed(
      await as(
        admin,
        "authenticated",
        ids.admin,
        `insert into activity_log (user_name,action,target) values ('Admin','Edited','Home')`,
      ),
      "own insert",
    );
  });
  await t("admin cannot spoof another user's id", async () => {
    denied(
      await as(
        admin,
        "authenticated",
        ids.admin,
        `insert into activity_log (user_id,user_name,action) values ('${ids.super}','Super','Fake')`,
      ),
      "spoof",
    );
  });
  await t("log is append-only and admin-readable only", async () => {
    denied(
      await as(admin, "authenticated", ids.admin, "update activity_log set action='x'"),
      "update",
    );
    denied(await as(admin, "authenticated", ids.admin, "delete from activity_log"), "delete");
    expect(
      (await as(admin, "anon", "", "select * from activity_log")).rows.length === 0,
      "anon read",
    );
    expect(
      (await as(admin, "authenticated", ids.admin, "select * from activity_log")).rows.length === 1,
      "admin read",
    );
    denied(
      await as(
        admin,
        "anon",
        "",
        "insert into activity_log (user_id,user_name,action) values (null,'x','y')",
      ),
      "anon insert",
    );
  });

  console.log("media library");
  await t("anon can read objects in the media bucket but not upload", async () => {
    await admin.query("insert into storage.objects (bucket_id,name) values ('media','a.png')");
    expect(
      (await as(admin, "anon", "", "select name from storage.objects")).rows.length === 1,
      "anon read",
    );
    denied(
      await as(
        admin,
        "anon",
        "",
        "insert into storage.objects (bucket_id,name) values ('media','evil.png')",
      ),
      "anon upload",
    );
  });
  await t("plain user cannot upload", async () => {
    denied(
      await as(
        admin,
        "authenticated",
        ids.plain,
        "insert into storage.objects (bucket_id,name) values ('media','p.png')",
      ),
      "plain upload",
    );
  });
  await t("admin can upload/replace/delete in media bucket", async () => {
    allowed(
      await as(
        admin,
        "authenticated",
        ids.admin,
        "insert into storage.objects (bucket_id,name) values ('media','ok.png')",
      ),
      "upload",
    );
    expect(
      (
        await as(
          admin,
          "authenticated",
          ids.admin,
          "update storage.objects set name='ok2.png' where name='ok.png'",
        )
      ).rowCount === 1,
      "update",
    );
    expect(
      (
        await as(
          admin,
          "authenticated",
          ids.admin,
          "delete from storage.objects where name='ok2.png'",
        )
      ).rowCount === 1,
      "delete",
    );
  });
  await t("admin cannot write to any other bucket", async () => {
    await admin.query(
      "insert into storage.buckets (id,name) values ('private-stuff','private-stuff')",
    );
    denied(
      await as(
        admin,
        "authenticated",
        ids.admin,
        "insert into storage.objects (bucket_id,name) values ('private-stuff','x')",
      ),
      "other bucket",
    );
  });
  await t("bucket is public, 10 MB limit, no SVG/HTML", async () => {
    const b = (await admin.query("select * from storage.buckets where id='media'")).rows[0];
    expect(b.public === true && Number(b.file_size_limit) === 10485760, "settings");
    expect(!b.allowed_mime_types.some((m) => /svg|html/.test(m)), "dangerous mime allowed");
  });
  await t("media_assets: admin manages, anon sees nothing", async () => {
    allowed(
      await as(
        admin,
        "authenticated",
        ids.admin,
        "insert into media_assets (path,name) values ('ok.png','ok.png')",
      ),
      "asset insert",
    );
    expect(
      (await as(admin, "anon", "", "select * from media_assets")).rows.length === 0,
      "anon read",
    );
    denied(
      await as(admin, "anon", "", "insert into media_assets (path,name) values ('z','z')"),
      "anon insert",
    );
  });
} finally {
  await admin.end();
  await server.stop();
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
