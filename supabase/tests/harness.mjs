// Throwaway real-Postgres harness for the Supabase migrations: stubs the pieces Supabase provides
// (API roles, auth.uid(), storage) and lets tests run SQL as anon / a signed-in user / the service role.
// Spins up a throwaway real Postgres, stubs the Supabase-provided pieces (roles, auth.uid(), storage),
// applies the project's migrations and exposes helpers to run SQL as a given Supabase role/user.
import EmbeddedPostgres from "embedded-postgres";
import pg from "pg";
import fs from "node:fs";
import path from "node:path";

import os from "node:os";
import { fileURLToPath } from "node:url";

export const MIGRATIONS = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../migrations",
);

const STUBS = `
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
create schema auth;
create table auth.users (id uuid primary key default gen_random_uuid(), email text unique, created_at timestamptz default now());
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create schema storage;
create table storage.buckets (id text primary key, name text, public boolean default false, file_size_limit bigint, allowed_mime_types text[]);
create table storage.objects (id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text, owner uuid, metadata jsonb, created_at timestamptz default now());
alter table storage.objects enable row level security;
grant usage on schema auth, storage, public to anon, authenticated, service_role;
grant select on auth.users to authenticated, service_role;
grant all on all tables in schema storage to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant execute on functions to anon, authenticated, service_role;
`;

export async function start() {
  const dir = path.join(os.tmpdir(), `finenvision-pgtest-${process.pid}`);
  fs.rmSync(dir, { recursive: true, force: true });
  const server = new EmbeddedPostgres({
    databaseDir: dir,
    user: "postgres",
    password: "pw",
    port: Number(process.env.PGTEST_PORT || 54777),
    persistent: false,
  });
  await server.initialise();
  await server.start();
  const admin = new pg.Client({
    host: "localhost",
    port: Number(process.env.PGTEST_PORT || 54777),
    user: "postgres",
    password: "pw",
    database: "postgres",
  });
  await admin.connect();
  await admin.query(STUBS);
  return { server, admin };
}

export async function migrate(admin) {
  const files = fs
    .readdirSync(MIGRATIONS)
    .filter((f) => f.endsWith(".sql"))
    .sort();
  for (const f of files) {
    try {
      await admin.query(fs.readFileSync(path.join(MIGRATIONS, f), "utf-8"));
      console.log("  applied", f);
    } catch (e) {
      console.log("  FAILED ", f, "->", e.message, e.position ? `(pos ${e.position})` : "");
      throw e;
    }
  }
}

/** Run `sql` as a Supabase role. role: 'anon' | 'authenticated' | 'service_role'. */
export async function as(admin, role, userId, sql, params = []) {
  await admin.query("begin");
  try {
    await admin.query(`set local role ${role}`);
    await admin.query(`select set_config('request.jwt.claim.sub', $1, true)`, [userId || ""]);
    const res = await admin.query(sql, params);
    await admin.query("commit");
    return { ok: true, rows: res.rows, rowCount: res.rowCount };
  } catch (e) {
    await admin.query("rollback");
    return { ok: false, error: e.message };
  }
}
