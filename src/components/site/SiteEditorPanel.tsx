import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff, RotateCcw, Search, X } from "lucide-react";
import { getAdminStore, saveAdminStore, useAdminStore } from "@/lib/admin-store";
import { bumpPageEpoch } from "@/lib/editable/epoch";
import { getSeen, getSeenSections, startCollecting, type EntryKind } from "@/lib/editable/patch";
import { ImageField } from "@/components/admin/MediaPicker";

type Tab = "text" | "links" | "images" | "sections";

const KIND_LABEL: Record<EntryKind, string> = {
  text: "Text",
  href: "Link",
  src: "Image",
  alt: "Image description",
  ph: "Form hint",
};

/** Side panel listing everything the current page rendered, with an input for each replaceable item. */
export default function SiteEditorPanel({ onClose }: { onClose: () => void }) {
  const store = useAdminStore();
  const [tab, setTab] = useState<Tab>("text");
  const [query, setQuery] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [snapshot, setSnapshot] = useState(0);
  const [saved, setSaved] = useState(false);

  // Give the freshly remounted page a moment to render, then read what it used.
  useEffect(() => {
    const id = setTimeout(() => setSnapshot((n) => n + 1), 500);
    return () => clearTimeout(id);
  }, []);

  const entries = useMemo(() => getSeen(), [snapshot]);
  const sections = useMemo(() => getSeenSections(), [snapshot]);
  const overrides = store.textOverrides;

  const inTab = (kind: EntryKind) =>
    tab === "text"
      ? kind === "text" || kind === "alt" || kind === "ph"
      : tab === "links"
        ? kind === "href"
        : kind === "src";

  const visible = entries.filter(
    (e) =>
      inTab(e.kind) &&
      (!query.trim() ||
        e.value.toLowerCase().includes(query.trim().toLowerCase()) ||
        (overrides[e.key] ?? "").toLowerCase().includes(query.trim().toLowerCase())),
  );

  const current = (key: string, original: string) => edits[key] ?? overrides[key] ?? original;
  const pending = Object.keys(edits).length;

  const apply = () => {
    const next = { ...getAdminStore().textOverrides };
    for (const [key, value] of Object.entries(edits)) {
      const original = entries.find((e) => e.key === key)?.value ?? "";
      if (!value.trim() || value.trim() === original) delete next[key];
      else next[key] = value.trim();
    }
    saveAdminStore(
      { ...getAdminStore(), textOverrides: next },
      { action: "Edited page text", target: window.location.pathname },
    );
    setEdits({});
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
    startCollecting();
    bumpPageEpoch();
    setTimeout(() => setSnapshot((n) => n + 1), 500);
  };

  const toggleSection = (key: string) => {
    const hidden = new Set(getAdminStore().hiddenSections);
    if (hidden.has(key)) hidden.delete(key);
    else hidden.add(key);
    saveAdminStore(
      { ...getAdminStore(), hiddenSections: [...hidden] },
      { action: hidden.has(key) ? "Hid a page section" : "Showed a page section", target: key },
    );
  };

  const tabs: Array<[Tab, string]> = [
    ["text", "Text"],
    ["links", "Links"],
    ["images", "Images"],
    ["sections", "Sections"],
  ];

  return (
    <aside
      className="admin-scope fixed bottom-0 right-0 top-0 z-[90] flex w-full max-w-md flex-col border-l border-slate-200 bg-white text-slate-900 shadow-2xl"
      aria-label="Page editor"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h2 className="text-sm font-bold">Edit this page</h2>
          <p className="text-[11px] text-slate-500">
            Changes go to your draft. Publish from the admin bar.
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close editor"
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex gap-1 border-b border-slate-100 px-3 py-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
              tab === key ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => {
            startCollecting();
            bumpPageEpoch();
            setTimeout(() => setSnapshot((n) => n + 1), 500);
          }}
          title="Re-scan the page (after opening tabs or menus)"
          className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      {tab !== "sections" && (
        <div className="border-b border-slate-100 p-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <p className="mt-2 text-[11px] leading-snug text-slate-400">
            A change applies everywhere this exact{" "}
            {tab === "links" ? "link" : tab === "images" ? "image" : "wording"} appears on the site.
            Clear the box to go back to the original.
          </p>
        </div>
      )}

      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {tab === "sections" ? (
          sections.length === 0 ? (
            <p className="py-10 text-center text-xs text-slate-400">
              This page has no hideable sections.
            </p>
          ) : (
            <ul className="space-y-2">
              {sections.map((s) => {
                const hidden = store.hiddenSections.includes(s.key);
                return (
                  <li
                    key={s.key}
                    className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                  >
                    <span
                      className={`text-xs font-semibold ${hidden ? "text-slate-400 line-through" : ""}`}
                    >
                      {s.label}
                    </span>
                    <button
                      onClick={() => toggleSection(s.key)}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-semibold ${
                        hidden ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {hidden ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                      {hidden ? "Hidden" : "Shown"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )
        ) : visible.length === 0 ? (
          <p className="py-10 text-center text-xs text-slate-400">
            {entries.length === 0 ? "Scanning the page…" : "Nothing found here."}
          </p>
        ) : tab === "images" ? (
          visible.map((e) => (
            <div key={e.key} className="rounded-xl border border-slate-200 p-3">
              <ImageField
                label={e.value.split("/").pop() || "Image"}
                value={current(e.key, e.value)}
                onChange={(url) => setEdits((d) => ({ ...d, [e.key]: url }))}
              />
            </div>
          ))
        ) : (
          visible.map((e) => {
            const value = current(e.key, e.value);
            const changed = value.trim() !== e.value;
            const long = e.value.length > 80 || e.kind === "text";
            return (
              <div
                key={e.key}
                className={`rounded-xl border p-3 ${changed ? "border-blue-300 bg-blue-50/40" : "border-slate-200"}`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {KIND_LABEL[e.kind]}
                  </span>
                  {changed && (
                    <button
                      onClick={() => setEdits((d) => ({ ...d, [e.key]: "" }))}
                      className="text-[11px] font-semibold text-slate-500 hover:text-rose-600"
                    >
                      Reset
                    </button>
                  )}
                </div>
                {long ? (
                  <textarea
                    rows={Math.min(6, Math.max(2, Math.ceil(value.length / 48)))}
                    value={value}
                    onChange={(ev) => setEdits((d) => ({ ...d, [e.key]: ev.target.value }))}
                    className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(ev) => setEdits((d) => ({ ...d, [e.key]: ev.target.value }))}
                    className={`w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 ${e.kind === "href" ? "font-mono" : ""}`}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 p-3">
        <Link to="/admin/text" className="text-[11px] font-semibold text-blue-600 hover:underline">
          Manage all edits
        </Link>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-[11px] font-semibold text-emerald-600">Saved to draft</span>
          )}
          <button
            onClick={apply}
            disabled={pending === 0}
            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
          >
            Apply {pending > 0 ? `(${pending})` : ""}
          </button>
        </div>
      </div>
    </aside>
  );
}
