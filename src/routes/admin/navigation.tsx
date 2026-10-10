import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutPanelTop,
  Save,
  Undo2,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  getAdminStore,
  saveAdminStore,
  useAdminStore,
  type FooterSettings,
  type MenuLink,
  type NavigationSettings,
  type SocialLink,
  type SocialPlatform,
} from "@/lib/admin-store";
import { isHttpUrl, isValidLinkTarget } from "@/lib/links";
import { CORE_PAGES, linkTargetExists, toPublicPath } from "@/lib/pages";

export const Route = createFileRoute("/admin/navigation")({
  component: AdminNavigationPage,
});

type Draft = { navigation: NavigationSettings; footer: FooterSettings };

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

const PLATFORMS: Array<{ value: SocialPlatform; label: string }> = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "facebook", label: "Facebook" },
  { value: "x", label: "X (Twitter)" },
];

const inputCls =
  "w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-600";
const cardCls =
  "bg-white p-6 rounded-2xl border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4";
const iconBtn =
  "p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent";

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 accent-blue-600"
      />
      {label}
    </label>
  );
}

function SectionTitle({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="pb-3 border-b border-slate-100">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {hint && <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>}
    </div>
  );
}

/**
 * Pick one of the site's pages (recommended: the link then follows the page if its address is
 * renamed), or type any path / URL. Warns when a same-site path matches no page.
 */
function TargetField({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (to: string) => void;
  invalid: boolean;
}) {
  const store = useAdminStore();
  const page = CORE_PAGES.find((p) => p.defaultPath === value.trim());
  const [customMode, setCustomMode] = useState(!page);
  const missing = !invalid && value.trim() !== "" && !linkTargetExists(value, store);

  return (
    <div className="space-y-1.5">
      <select
        value={customMode ? "__custom__" : value}
        onChange={(e) => {
          if (e.target.value === "__custom__") {
            setCustomMode(true);
          } else {
            setCustomMode(false);
            onChange(e.target.value);
          }
        }}
        aria-label="Link destination"
        className={inputCls}
      >
        <optgroup label="Pages on this site">
          {CORE_PAGES.map((p) => (
            <option key={p.defaultPath} value={p.defaultPath}>
              {p.title} — {toPublicPath(p.defaultPath)}
            </option>
          ))}
        </optgroup>
        <option value="__custom__">Custom path or external URL…</option>
      </select>
      {customMode && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.trim())}
          placeholder="/page-slug, /#section or https://…"
          aria-label="Link target"
          className={`${inputCls} font-mono ${invalid || missing ? "border-rose-400" : ""}`}
        />
      )}
      {invalid && (
        <p className="text-[11px] text-rose-600">
          Use a path like /about, or a full http(s)://, mailto: or tel: link.
        </p>
      )}
      {missing && (
        <p className="text-[11px] text-amber-700">
          No page exists at this address, so visitors would see a 404 page. Pick a page above, or
          add a redirect for it under SEO.
        </p>
      )}
    </div>
  );
}

function LinkListEditor({
  links,
  onChange,
  addLabel,
  idPrefix,
}: {
  links: MenuLink[];
  onChange: (next: MenuLink[]) => void;
  addLabel: string;
  idPrefix: string;
}) {
  const update = (id: string, patch: Partial<MenuLink>) =>
    onChange(links.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  return (
    <div className="space-y-2">
      {links.length === 0 && (
        <p className="text-[11px] text-slate-400 italic">No links yet. Add one below.</p>
      )}
      {links.map((l, i) => {
        const badTarget = l.to.trim() !== "" && !isValidLinkTarget(l.to);
        return (
          <div
            key={l.id}
            className={`rounded-xl border p-3 space-y-2 ${
              l.isActive ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-70"
            }`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1.4fr_auto] gap-2 items-start">
              <input
                type="text"
                value={l.label}
                onChange={(e) => update(l.id, { label: e.target.value })}
                placeholder="Label"
                aria-label="Link label"
                className={inputCls}
              />
              <TargetField
                value={l.to}
                onChange={(to) => update(l.id, { to })}
                invalid={badTarget}
              />
              <div className="flex items-center justify-end gap-0.5">
                <button
                  type="button"
                  className={iconBtn}
                  disabled={i === 0}
                  onClick={() => onChange(move(links, i, -1))}
                  aria-label="Move up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  disabled={i === links.length - 1}
                  onClick={() => onChange(move(links, i, 1))}
                  aria-label="Move down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className={`${iconBtn} hover:text-rose-600`}
                  onClick={() => onChange(links.filter((x) => x.id !== l.id))}
                  aria-label="Delete link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              <Toggle
                checked={l.isActive}
                onChange={(v) => update(l.id, { isActive: v })}
                label="Visible"
              />
              <Toggle
                checked={l.openInNewTab}
                onChange={(v) => update(l.id, { openInNewTab: v })}
                label="Open in new tab"
              />
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() =>
          onChange([
            ...links,
            { id: uid(idPrefix), label: "", to: "/", isActive: true, openInNewTab: false },
          ])
        }
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50"
      >
        <Plus className="w-3.5 h-3.5" /> {addLabel}
      </button>
    </div>
  );
}

function collectErrors(d: Draft): string[] {
  const errors: string[] = [];
  const checkLinks = (where: string, links: MenuLink[]) =>
    links.forEach((l, i) => {
      if (!l.label.trim()) errors.push(`${where}: link ${i + 1} needs a label.`);
      if (!isValidLinkTarget(l.to))
        errors.push(`${where}: "${l.label || i + 1}" has an invalid target.`);
    });

  checkLinks("Header menu", d.navigation.links);
  d.footer.columns.forEach((c, i) => {
    if (!c.title.trim()) errors.push(`Footer column ${i + 1} needs a title.`);
    checkLinks(`Footer column "${c.title || i + 1}"`, c.links);
  });
  checkLinks("Bottom bar links", d.footer.legalLinks);
  d.footer.socials.forEach((s) => {
    if (!isHttpUrl(s.url)) errors.push(`Social link (${s.platform}) needs a full https:// URL.`);
  });

  const login = d.navigation.loginButton;
  if (login.enabled) {
    if (!login.label.trim()) errors.push("Login button needs a label.");
    if (!isValidLinkTarget(login.url)) errors.push("Login button URL is invalid.");
  }
  const secs = d.navigation.announcementBar.rotateSeconds;
  if (!Number.isFinite(secs) || secs < 2 || secs > 60) {
    errors.push("Announcement rotation must be between 2 and 60 seconds.");
  }
  return errors;
}

export function AdminNavigationPage() {
  const saved = useAdminStore();
  const [draft, setDraft] = useState<Draft>(() => {
    const s = getAdminStore();
    return { navigation: clone(s.navigation), footer: clone(s.footer) };
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [justSaved, setJustSaved] = useState(false);

  const dirty =
    JSON.stringify(draft) !==
    JSON.stringify({ navigation: saved.navigation, footer: saved.footer });

  const setNav = (patch: Partial<NavigationSettings>) =>
    setDraft((d) => ({ ...d, navigation: { ...d.navigation, ...patch } }));
  const setFooter = (patch: Partial<FooterSettings>) =>
    setDraft((d) => ({ ...d, footer: { ...d.footer, ...patch } }));

  const handleSave = () => {
    const found = collectErrors(draft);
    setErrors(found);
    if (found.length) return;
    saveAdminStore(
      { ...getAdminStore(), navigation: clone(draft.navigation), footer: clone(draft.footer) },
      { action: "Updated Header & Footer Menus", target: "Navigation / Footer" },
    );
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 3000);
  };

  const handleDiscard = () => {
    setDraft({ navigation: clone(saved.navigation), footer: clone(saved.footer) });
    setErrors([]);
  };

  const login = draft.navigation.loginButton;
  const setLogin = (patch: Partial<NavigationSettings["loginButton"]>) =>
    setNav({ loginButton: { ...login, ...patch } });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="[@media(min-height:800px)]:sticky top-16 z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutPanelTop className="w-5 h-5 text-blue-600" />
            Header & Footer Menus
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Control the top notice bar, navigation links, login button, footer columns, social icons
            and the bottom bar of the public website.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {justSaved && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Published!
            </span>
          )}
          {dirty && !justSaved && (
            <span className="text-[11px] font-semibold text-amber-600">Unsaved changes</span>
          )}
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!dirty}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40"
          >
            <Undo2 className="w-3.5 h-3.5" /> Discard
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" /> Save & Publish
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <p className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4" /> Fix these before saving
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-0.5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Announcement bar */}
      <div className={cardCls}>
        <SectionTitle
          title="Top announcement bar"
          hint="Active notices rotate in priority order and pause while hovered."
        />
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Toggle
            checked={draft.navigation.announcementBar.enabled}
            onChange={(v) =>
              setNav({ announcementBar: { ...draft.navigation.announcementBar, enabled: v } })
            }
            label="Show the bar"
          />
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700">
            Rotate every
            <input
              type="number"
              min={2}
              max={60}
              value={draft.navigation.announcementBar.rotateSeconds}
              onChange={(e) =>
                setNav({
                  announcementBar: {
                    ...draft.navigation.announcementBar,
                    rotateSeconds: Number(e.target.value),
                  },
                })
              }
              className={`${inputCls} !w-16 text-center`}
            />
            seconds
          </label>
          <Link
            to="/admin/announcements"
            className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            Edit the notices themselves <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Header menu */}
      <div className={cardCls}>
        <SectionTitle
          title="Header navigation"
          hint="Order here is the order on the site. Use a path (/courses) for pages on this site, or a full URL."
        />
        <LinkListEditor
          links={draft.navigation.links}
          onChange={(links) => setNav({ links })}
          addLabel="Add menu link"
          idPrefix="nav"
        />
        <div className="pt-2 border-t border-slate-100">
          <Toggle
            checked={draft.navigation.showPhoneButton}
            onChange={(v) => setNav({ showPhoneButton: v })}
            label="Show the phone-number button (number comes from Pages → Header & Footer)"
          />
        </div>
      </div>

      {/* Login button */}
      <div className={cardCls}>
        <SectionTitle
          title="Login button"
          hint="The highlighted button at the right of the header."
        />
        <Toggle
          checked={login.enabled}
          onChange={(v) => setLogin({ enabled: v })}
          label="Show the login button"
        />
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 gap-3 ${login.enabled ? "" : "opacity-50"}`}
        >
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Label</label>
            <input
              type="text"
              value={login.label}
              onChange={(e) => setLogin({ label: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">URL</label>
            <input
              type="text"
              value={login.url}
              onChange={(e) => setLogin({ url: e.target.value.trim() })}
              className={`${inputCls} font-mono`}
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Hover tooltip title
            </label>
            <input
              type="text"
              value={login.tooltipTitle}
              onChange={(e) => setLogin({ tooltipTitle: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <Toggle
              checked={login.openInNewTab}
              onChange={(v) => setLogin({ openInNewTab: v })}
              label="Open in new tab"
            />
            <Toggle
              checked={login.showOrgCode}
              onChange={(v) => setLogin({ showOrgCode: v })}
              label="Show the app organisation code in the tooltip"
            />
          </div>
        </div>
        <p className="text-[11px] text-slate-500">
          The organisation code is edited in Website Pages → Home Page → Mobile App section.
        </p>
      </div>

      {/* Footer columns */}
      <div className={cardCls}>
        <SectionTitle
          title="Footer link columns"
          hint="Each column appears next to the brand block. Empty or fully hidden columns are not shown."
        />
        <div className="space-y-4">
          {draft.footer.columns.map((col, ci) => (
            <div
              key={col.id}
              className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={col.title}
                  onChange={(e) =>
                    setFooter({
                      columns: draft.footer.columns.map((c) =>
                        c.id === col.id ? { ...c, title: e.target.value } : c,
                      ),
                    })
                  }
                  placeholder="Column title"
                  aria-label="Column title"
                  className={`${inputCls} font-bold`}
                />
                <button
                  type="button"
                  className={iconBtn}
                  disabled={ci === 0}
                  onClick={() => setFooter({ columns: move(draft.footer.columns, ci, -1) })}
                  aria-label="Move column up"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className={iconBtn}
                  disabled={ci === draft.footer.columns.length - 1}
                  onClick={() => setFooter({ columns: move(draft.footer.columns, ci, 1) })}
                  aria-label="Move column down"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className={`${iconBtn} hover:text-rose-600`}
                  onClick={() => {
                    if (confirm(`Delete the "${col.title || "untitled"}" column and its links?`)) {
                      setFooter({ columns: draft.footer.columns.filter((c) => c.id !== col.id) });
                    }
                  }}
                  aria-label="Delete column"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <LinkListEditor
                links={col.links}
                onChange={(links) =>
                  setFooter({
                    columns: draft.footer.columns.map((c) =>
                      c.id === col.id ? { ...c, links } : c,
                    ),
                  })
                }
                addLabel="Add link"
                idPrefix="fl"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setFooter({
                columns: [
                  ...draft.footer.columns,
                  { id: uid("col"), title: "New column", links: [] },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            <Plus className="w-3.5 h-3.5" /> Add footer column
          </button>
        </div>
      </div>

      {/* Socials */}
      <div className={cardCls}>
        <SectionTitle
          title="Social icons"
          hint="Shown under the footer brand block and used as the site's official profiles for search engines (WhatsApp excluded)."
        />
        <div className="space-y-2">
          {draft.footer.socials.map((s, i) => {
            const bad = s.url.trim() !== "" && !isHttpUrl(s.url);
            const update = (patch: Partial<SocialLink>) =>
              setFooter({
                socials: draft.footer.socials.map((x) => (x.id === s.id ? { ...x, ...patch } : x)),
              });
            return (
              <div
                key={s.id}
                className={`grid grid-cols-1 sm:grid-cols-[9rem_1fr_auto] gap-2 items-start rounded-xl border border-slate-200 p-3 ${
                  s.isActive ? "bg-white" : "bg-slate-50 opacity-70"
                }`}
              >
                <select
                  value={s.platform}
                  onChange={(e) => update({ platform: e.target.value as SocialPlatform })}
                  aria-label="Platform"
                  className={inputCls}
                >
                  {PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <div>
                  <input
                    type="text"
                    value={s.url}
                    onChange={(e) => update({ url: e.target.value.trim() })}
                    placeholder={
                      s.platform === "whatsapp"
                        ? "https://wa.me/91XXXXXXXXXX"
                        : "https://www.example.com/your-profile"
                    }
                    aria-label="Profile URL"
                    className={`${inputCls} font-mono ${bad ? "border-rose-400" : ""}`}
                  />
                  {bad && (
                    <p className="mt-1 text-[11px] text-rose-600">Must start with https://</p>
                  )}
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Toggle
                    checked={s.isActive}
                    onChange={(v) => update({ isActive: v })}
                    label="Visible"
                  />
                  <button
                    type="button"
                    className={iconBtn}
                    disabled={i === 0}
                    onClick={() => setFooter({ socials: move(draft.footer.socials, i, -1) })}
                    aria-label="Move up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className={iconBtn}
                    disabled={i === draft.footer.socials.length - 1}
                    onClick={() => setFooter({ socials: move(draft.footer.socials, i, 1) })}
                    aria-label="Move down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className={`${iconBtn} hover:text-rose-600`}
                    onClick={() =>
                      setFooter({ socials: draft.footer.socials.filter((x) => x.id !== s.id) })
                    }
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() =>
              setFooter({
                socials: [
                  ...draft.footer.socials,
                  { id: uid("soc"), platform: "facebook", url: "https://", isActive: true },
                ],
              })
            }
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-dashed border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            <Plus className="w-3.5 h-3.5" /> Add social icon
          </button>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={cardCls}>
        <SectionTitle
          title="Footer bottom bar"
          hint="Legal links next to the copyright line. The copyright text itself is edited in Pages → Header & Footer."
        />
        <LinkListEditor
          links={draft.footer.legalLinks}
          onChange={(legalLinks) => setFooter({ legalLinks })}
          addLabel="Add legal link"
          idPrefix="lg"
        />
        <div className="pt-2 border-t border-slate-100">
          <Toggle
            checked={draft.footer.showStaffPortalLink}
            onChange={(v) => setFooter({ showStaffPortalLink: v })}
            label="Show the discreet “Staff Portal” link (staff can still reach /admin-login directly)"
          />
        </div>
      </div>
    </div>
  );
}
