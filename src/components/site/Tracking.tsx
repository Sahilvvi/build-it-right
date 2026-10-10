import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useAdminStore } from "@/lib/admin-store";
import {
  cleanTrackingId,
  injectCustomHtml,
  loadTrackers,
  trackPageView,
  type TrackerKind,
} from "@/lib/tracking";

/** Mounted once in the root. Renders nothing; never runs inside the /admin portal. */
export function Tracking() {
  const { tracking } = useAdminStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastPath = useRef<string | null>(null);

  const ga4 = cleanTrackingId("ga4", tracking.ga4Id);
  const gtm = cleanTrackingId("gtm", tracking.gtmId);
  const pixel = cleanTrackingId("pixel", tracking.metaPixelId);
  const headScript = tracking.customHeadScript;
  const bodyScript = tracking.customBodyScript;

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      lastPath.current = null;
      return;
    }
    const ids: Record<TrackerKind, string | null> = { ga4, gtm, pixel };
    const fresh = loadTrackers(ids);
    injectCustomHtml(headScript, "head");
    injectCustomHtml(bodyScript, "body");

    // Trackers loaded just now already reported this page; the rest need a manual page view.
    if (lastPath.current !== pathname) trackPageView(window.location.pathname, ids, fresh);
    lastPath.current = pathname;
  }, [pathname, ga4, gtm, pixel, headScript, bodyScript]);

  return null;
}
