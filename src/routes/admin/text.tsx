import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, Pencil, Search, Trash2, Type } from "lucide-react";
import { getAdminStore, saveAdminStore, useAdminStore } from "@/lib/admin-store";
import { requestEditorOpen } from "@/lib/editable/epoch";

export const Route = createFileRoute("/admin/text")({
  component: AdminTextPage,
});

const kindOf = (key: string) =>
  key.startsWith("href:")
    ? "Link"
    : key.startsWith("src:")
      ? "Image"
      : key.startsWith("alt:")
        ? "Image description"
        : key.startsWith("ph:")
          ? "Form hint"
          : "Text";
const originalOf = (key: string) => key.replace(/^(href|src|alt|ph):/, "");

export function AdminTextPage() {
  const store = useAdminStore();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const entries = Object.entries(store.textOverrides).filter(
    ([key, value]) =>
      !query.trim() ||
      key.toLowerCase().includes(query.trim().toLowerCase()) ||
      value.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const revert = (key: string) => {
    const next = { ...getAdminStore().textOverrides };
    delete next[key];
    saveAdminStore(
      { ...getAdminStore(), textOverrides: next },
      { action: "Reverted a text edit", target: originalOf(key).slice(0, 60) },
    );
  };

  const revertAll = () => {
    if (!confirm("Put every edited text, link and image back to the original wording?")) return;
    saveAdminStore(
      { ...getAdminStore(), textOverrides: {} },
      { action: "Reverted all text edits", target: "All pages" },
    );
  };

  const showSection = (key: string) =>
    saveAdminStore(
      { ...getAdminStore(), hiddenSections: store.hiddenSections.filter((k) => k !== key) },
      { action: "Showed a page section", target: key },
    );

  const openEditor = () => {
    requestEditorOpen();
    navigate({ to: "/" });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
            <Type className="h-5 w-5 text-blue-600" />
            Page Text, Links &amp; Sections
          </h1>
          <p className="mt-1 max-w-2xl text-xs text-slate-500">
            Any wording, link or image on the public pages can be changed without touching code.
            Open the site, click <strong>Edit this page</strong>, and the editor lists everything on
            that page. This screen shows every edit made so far and lets you undo them.
          </p>
        </div>
        <button
          onClick={openEditor}
          className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
        >
          <Pencil className="h-3.5 w-3.5" /> Open the site editor
        </button>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">
            Edits ({Object.keys(store.textOverrides).length})
          </h2>
          <div className="flex items-center gap-2">
            <div className="relative w-56">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search edits…"
                className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>
            {Object.keys(store.textOverrides).length > 0 && (
              <button
                onClick={revertAll}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Revert all
              </button>
            )}
          </div>
        </div>

        {entries.length === 0 ? (
          <p className="py-10 text-center text-xs text-slate-400">
            {Object.keys(store.textOverrides).length === 0
              ? "No edits yet. Everything on the site shows its original wording."
              : "No edits match your search."}
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {entries.map(([key, value]) => (
              <li key={key} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0 space-y-1 text-xs">
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">
                    {kindOf(key)}
                  </span>
                  <p className="break-words text-slate-400 line-through">{originalOf(key)}</p>
                  <p className="break-words font-medium text-slate-900">{value}</p>
                </div>
                <button
                  onClick={() => revert(key)}
                  title="Revert to the original"
                  aria-label="Revert to the original"
                  className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h2 className="text-sm font-bold text-slate-900">
          Hidden sections ({store.hiddenSections.length})
        </h2>
        {store.hiddenSections.length === 0 ? (
          <p className="text-xs text-slate-400">Every section of every page is showing.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {store.hiddenSections.map((key) => (
              <li key={key} className="flex items-center justify-between py-2.5 text-xs">
                <span className="font-mono text-slate-700">{key}</span>
                <button
                  onClick={() => showSection(key)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 font-semibold text-slate-700 hover:bg-slate-200"
                >
                  <Eye className="h-3.5 w-3.5" /> Show again
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
