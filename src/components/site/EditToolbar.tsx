import { lazy, Suspense, useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Loader2, Pencil } from "lucide-react";
import {
  getCurrentAdmin,
  isAdminDataLoaded,
  loadAdminData,
  restoreAdminSession,
} from "@/lib/admin-store";
import { bumpPageEpoch, consumeEditorOpenRequest } from "@/lib/editable/epoch";
import { startCollecting, stopCollecting } from "@/lib/editable/patch";

// The editor is only ever downloaded for a signed-in admin who opens it.
const SiteEditorPanel = lazy(() => import("./SiteEditorPanel"));

/** "Edit this page" button, shown on the public site to signed-in admins only. */
export function EditToolbar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  const openEditor = async () => {
    setBusy(true);
    setError("");
    try {
      if (!isAdminDataLoaded()) {
        const user = await restoreAdminSession();
        if (!user) throw new Error("Your session expired. Please sign in again.");
        await loadAdminData();
      }
      startCollecting();
      bumpPageEpoch(); // re-render the page so every string it uses is recorded
      setOpen(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open the editor.");
    } finally {
      setBusy(false);
    }
  };

  const closeEditor = () => {
    stopCollecting();
    setOpen(false);
  };

  const signedIn = mounted && !!getCurrentAdmin();
  const onAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (signedIn && !onAdmin && consumeEditorOpenRequest()) void openEditor();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn, onAdmin]);

  // Leaving the page while the editor is open starts a fresh recording for the new page.
  useEffect(() => {
    if (open) {
      startCollecting();
      bumpPageEpoch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!signedIn || onAdmin) return null;

  return (
    <>
      {!open && (
        <div className="fixed bottom-4 left-4 z-[80] flex flex-col items-start gap-2">
          {error && (
            <p
              role="alert"
              className="max-w-xs rounded-lg bg-rose-600 px-3 py-2 text-xs font-medium text-white shadow-lg"
            >
              {error}
            </p>
          )}
          <button
            onClick={() => void openEditor()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-lg ring-1 ring-white/20 hover:bg-slate-800 disabled:opacity-70"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
            Edit this page
          </button>
        </div>
      )}
      {open && (
        <Suspense fallback={null}>
          <SiteEditorPanel onClose={closeEditor} />
        </Suspense>
      )}
    </>
  );
}
