import { useState } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { CORE_PAGES, linkTargetExists, toPublicPath } from "@/lib/pages";

const inputCls =
  "w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-600";

/**
 * Pick one of the site's pages (recommended: the link then follows the page if its address is
 * renamed), or type any path / URL. Warns when a same-site path matches no page.
 */
export function LinkTargetField({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (to: string) => void;
  invalid: boolean;
}) {
  const store = useAdminStore();
  const page =
    CORE_PAGES.find((p) => p.defaultPath === value.trim()) ??
    store.customPages.find((p) => `/${p.slug}` === value.trim());
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
        {store.customPages.length > 0 && (
          <optgroup label="Pages you created">
            {store.customPages.map((p) => (
              <option key={p.id} value={`/${p.slug}`}>
                {p.title} — /{p.slug}
                {p.status === "hidden" ? " (hidden)" : ""}
              </option>
            ))}
          </optgroup>
        )}
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
