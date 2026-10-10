import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { History, Loader2, RotateCcw, AlertCircle } from "lucide-react";
import {
  hasUnpublishedChanges,
  listRevisions,
  restoreRevision,
  useAdminStore,
  type RevisionSummary,
} from "@/lib/admin-store";

// Restoring reloads the draft, which remounts the page; remember the confirmation across that.
let restoredAt = 0;

export const Route = createFileRoute("/admin/history")({
  component: AdminHistoryPage,
});

export function AdminHistoryPage() {
  const store = useAdminStore();
  const [revisions, setRevisions] = useState<RevisionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [restored, setRestored] = useState(() => Date.now() - restoredAt < 20_000);

  const refresh = useCallback(async () => {
    try {
      setRevisions(await listRevisions());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load the history.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const nameOf = (id: string | null) =>
    store.users.find((u) => u.id === id)?.name ?? (id ? "An administrator" : "System");

  const handleRestore = async (rev: RevisionSummary) => {
    const when = new Date(rev.createdAt).toLocaleString();
    const warning = hasUnpublishedChanges()
      ? "\n\nYour current unpublished changes will be replaced."
      : "";
    if (
      !confirm(
        `Load the version published on ${when} into your draft?${warning}\n\nNothing goes live until you press Publish.`,
      )
    )
      return;
    setBusyId(rev.id);
    setError("");
    try {
      await restoreRevision(rev.id);
      restoredAt = Date.now();
      setRestored(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not restore that version.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs">
        <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <History className="h-5 w-5 text-blue-600" />
          Version History
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Every time changes are published, a copy of the website content is kept (the latest 40).
          Restoring one loads it into your draft so you can review it before publishing, so you can
          always undo a bad publish.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {restored && (
        <div
          role="status"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-medium text-emerald-800"
        >
          Loaded into your draft. Review the site with Preview, then Publish to make it live.
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        {loading ? (
          <p className="p-12 text-center text-xs text-slate-400">Loading…</p>
        ) : revisions.length === 0 ? (
          <p className="p-12 text-center text-xs text-slate-400">
            Nothing has been published yet. Versions appear here after you publish.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {revisions.map((rev, i) => (
              <li key={rev.id} className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-semibold text-slate-900">
                      {rev.note || "Published changes"}
                    </span>
                    {i === 0 && (
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleString()} · {nameOf(rev.createdBy)}
                  </div>
                </div>
                <button
                  onClick={() => void handleRestore(rev)}
                  disabled={busyId !== null}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {busyId === rev.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="h-3.5 w-3.5" />
                  )}
                  Restore to draft
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
