import { Link, useRouterState } from "@tanstack/react-router";
import { Eye } from "lucide-react";
import { getCurrentAdmin, hasUnpublishedChanges, useAdminStore } from "@/lib/admin-store";

/**
 * Shown only to a signed-in admin who is looking at the public site with an unpublished draft
 * loaded, so it is obvious that what is on screen is not live yet.
 */
export function PreviewBar() {
  useAdminStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/admin") || !getCurrentAdmin() || !hasUnpublishedChanges()) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 rounded-full border border-amber-300 bg-amber-50 py-2 pl-4 pr-2 text-xs font-semibold text-amber-900 shadow-lg"
    >
      <Eye className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap">Previewing unpublished draft</span>
      <Link
        to="/admin"
        className="rounded-full bg-amber-600 px-3 py-1.5 text-white hover:bg-amber-700"
      >
        Back to admin
      </Link>
    </div>
  );
}
