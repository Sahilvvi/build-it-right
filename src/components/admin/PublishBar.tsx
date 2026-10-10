import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Eye, Loader2, Rocket, Undo2, X } from "lucide-react";
import { discardDraft, hasUnpublishedChanges, publishSite, useAdminStore } from "@/lib/admin-store";

/**
 * Everything an admin edits is saved to a private draft. This bar appears whenever the draft
 * differs from the live site, and is the only way to push changes to visitors.
 */
export function PublishBar() {
  useAdminStore(); // re-render whenever the store changes
  const pending = hasUnpublishedChanges();
  const [confirm, setConfirm] = useState<"publish" | "discard" | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [justPublished, setJustPublished] = useState(false);

  useEffect(() => {
    if (!justPublished) return;
    const id = setTimeout(() => setJustPublished(false), 5000);
    return () => clearTimeout(id);
  }, [justPublished]);

  const run = async (kind: "publish" | "discard") => {
    setBusy(true);
    setError("");
    try {
      if (kind === "publish") {
        await publishSite(note);
        setJustPublished(true);
      } else {
        await discardDraft();
      }
      setConfirm(null);
      setNote("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {justPublished && !pending && (
        <div
          role="status"
          className="sticky top-14 z-20 mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800 md:top-[4.5rem]"
        >
          <CheckCircle2 className="h-4 w-4" /> Published. Visitors now see the latest version.
        </div>
      )}

      {pending && (
        <div className="sticky top-14 z-20 mb-4 flex flex-col gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between md:top-[4.5rem]">
          <p className="text-xs font-medium text-amber-900">
            <span className="font-bold">Unpublished changes.</span> Visitors still see the previous
            version until you publish.
          </p>
          <div className="flex shrink-0 flex-wrap gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
            >
              <Eye className="h-3.5 w-3.5" /> Preview
            </Link>
            <button
              onClick={() => setConfirm("discard")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-900 hover:bg-amber-100"
            >
              <Undo2 className="h-3.5 w-3.5" /> Discard
            </button>
            <button
              onClick={() => setConfirm("publish")}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
            >
              <Rocket className="h-3.5 w-3.5" /> Publish
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <div
          className="fixed inset-0 z-[65] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {confirm === "publish"
                  ? "Publish to the live website?"
                  : "Discard all draft changes?"}
              </h3>
              <button
                onClick={() => setConfirm(null)}
                disabled={busy}
                aria-label="Close"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              {confirm === "publish"
                ? "Every change you have made becomes visible to visitors immediately. A restorable copy is kept in Version History."
                : "Your unpublished edits are deleted and the editor goes back to exactly what is live. This cannot be undone."}
            </p>

            {confirm === "publish" && (
              <div className="mt-4">
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  What changed? (optional)
                </label>
                <input
                  type="text"
                  value={note}
                  maxLength={120}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. New CFA fees for the November batch"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            )}

            {error && (
              <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700">
                {error}
              </p>
            )}

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirm(null)}
                disabled={busy}
                className="flex-1 rounded-xl border border-slate-200 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => void run(confirm)}
                disabled={busy}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold text-white ${
                  confirm === "publish"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-rose-600 hover:bg-rose-700"
                } disabled:opacity-60`}
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {confirm === "publish" ? "Publish now" : "Discard changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
