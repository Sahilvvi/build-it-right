import { useState } from "react";
import { CheckCircle2, Link2, RotateCcw, Save } from "lucide-react";
import { getAdminStore, saveAdminStore, useAdminStore, type RedirectRule } from "@/lib/admin-store";
import { AUTO_REDIRECT_PREFIX, CORE_PAGES, checkPageSlug } from "@/lib/pages";
import { siteOrigin } from "@/lib/seo";

const renamable = CORE_PAGES.filter((p) => p.renamable);
const stripSlash = (p: string) => p.replace(/^\/+/, "");

/** Admin → SEO: choose the public web address of each page. */
export function PageAddressCard() {
  const saved = useAdminStore();
  const [draft, setDraft] = useState<Record<string, string>>(() => {
    const overrides = getAdminStore().pageSlugs;
    return Object.fromEntries(
      renamable.map((p) => [p.defaultPath, stripSlash(overrides[p.defaultPath] ?? "")]),
    );
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const savedInputs = (defaultPath: string) => stripSlash(saved.pageSlugs[defaultPath] ?? "");
  const dirty = renamable.some((p) => (draft[p.defaultPath] ?? "") !== savedInputs(p.defaultPath));

  const handleSave = () => {
    const found: Record<string, string> = {};
    const next: Record<string, string> = {};

    for (const page of renamable) {
      // Check against already-accepted renames plus the saved state of pages not yet processed.
      const res = checkPageSlug(page.defaultPath, draft[page.defaultPath] ?? "", {
        pageSlugs: { ...saved.pageSlugs, ...next },
        redirects: saved.redirects,
        customPages: saved.customPages,
      });
      if (!res.ok) found[page.defaultPath] = res.error;
      else if (res.path) next[page.defaultPath] = res.path;
      else next[page.defaultPath] = ""; // back to the built-in address
    }
    const finalPaths = Object.entries(next).filter(([, v]) => v);
    const seen = new Set<string>();
    for (const [key, value] of finalPaths) {
      if (seen.has(value)) found[key] = `"${value}" is used by two pages.`;
      seen.add(value);
    }
    setErrors(found);
    if (Object.keys(found).length) return;

    const overrides: Record<string, string> = {};
    for (const [key, value] of finalPaths) overrides[key] = value;

    // Old addresses keep working: add a permanent redirect from every address that just changed.
    let redirects: RedirectRule[] = [...saved.redirects];
    let stamp = Date.now();
    for (const page of renamable) {
      const before = saved.pageSlugs[page.defaultPath];
      const after = overrides[page.defaultPath];
      if (before === after) continue;
      const newPublic = after ?? page.defaultPath;
      // The address becoming live must not be shadowed by an old automatic redirect.
      redirects = redirects.filter(
        (r) =>
          !(
            r.id.startsWith(AUTO_REDIRECT_PREFIX) &&
            r.fromPath.toLowerCase() === newPublic.toLowerCase()
          ),
      );
      if (before) {
        redirects = redirects.filter((r) => r.fromPath.toLowerCase() !== before.toLowerCase());
        redirects.unshift({
          id: `${AUTO_REDIRECT_PREFIX}${stamp++}`,
          fromPath: before,
          toPath: newPublic,
          statusCode: 301,
          isActive: true,
        });
      }
    }

    const changed = renamable
      .filter((p) => saved.pageSlugs[p.defaultPath] !== overrides[p.defaultPath])
      .map((p) => `${p.defaultPath} → ${overrides[p.defaultPath] ?? p.defaultPath}`)
      .join(", ");
    saveAdminStore(
      { ...getAdminStore(), pageSlugs: overrides, redirects },
      { action: "Changed page address", target: changed },
    );
    setDone(true);
    setTimeout(() => setDone(false), 3500);
  };

  const origin = siteOrigin() ?? "";

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-blue-600" /> Page Web Addresses (URL slugs)
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5 max-w-2xl">
            Change where each page lives, e.g. <span className="font-mono">/cfa</span> →{" "}
            <span className="font-mono">/cfa-classes</span>. Menu links and the footer follow
            automatically, and the old address is permanently redirected so no visitor or Google
            ranking is lost.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {done && (
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Saved to draft
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40"
          >
            <Save className="w-3.5 h-3.5" /> Save addresses
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100 rounded-xl border border-slate-200">
        <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[12rem_minmax(0,1fr)] items-center gap-3 px-3 py-2.5 bg-slate-50/60 text-xs">
          <span className="font-semibold text-slate-900">Home</span>
          <span className="font-mono text-slate-500">
            {origin}/ <span className="font-sans text-[11px] text-slate-400">(fixed)</span>
          </span>
        </div>
        {renamable.map((page) => {
          const value = draft[page.defaultPath] ?? "";
          const error = errors[page.defaultPath];
          return (
            <div
              key={page.defaultPath}
              className="grid grid-cols-1 sm:grid-cols-[12rem_minmax(0,1fr)] items-start gap-2 sm:gap-3 px-3 py-2.5 text-xs"
            >
              <div>
                <div className="font-semibold text-slate-900">{page.title}</div>
                <div className="text-[11px] text-slate-400">
                  built-in: <span className="font-mono">{page.defaultPath}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex min-w-0 flex-1 items-center rounded-lg border bg-white px-2.5 ${
                      error ? "border-rose-400" : "border-slate-300"
                    }`}
                  >
                    <span className="shrink-0 font-mono text-slate-400">
                      <span className="hidden sm:inline">{origin}</span>/
                    </span>
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          [page.defaultPath]: e.target.value.toLowerCase(),
                        }))
                      }
                      placeholder={stripSlash(page.defaultPath)}
                      aria-label={`${page.title} web address`}
                      className="min-w-0 w-full py-1.5 font-mono text-xs bg-transparent focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    title="Back to the built-in address"
                    disabled={!value}
                    onClick={() => setDraft((d) => ({ ...d, [page.defaultPath]: "" }))}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
                {error ? (
                  <p className="mt-1 text-[11px] text-rose-600">{error}</p>
                ) : (
                  !value && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      Using the built-in address. Type a new slug to change it.
                    </p>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
