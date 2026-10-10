// Client-side analytics helpers. IDs come from Admin → Tracking & Pixels.

export type TrackerKind = "ga4" | "gtm" | "pixel";

const PATTERNS: Record<TrackerKind, RegExp> = {
  ga4: /^G-[A-Z0-9]{4,}$/i,
  gtm: /^GTM-[A-Z0-9]{4,}$/i,
  pixel: /^\d{8,20}$/,
};

/** Returns the trimmed ID, or null when it is empty, malformed or an obvious placeholder. */
export function cleanTrackingId(kind: TrackerKind, raw: string | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value || /X{4,}/i.test(value) || !PATTERNS[kind].test(value)) return null;
  return value;
}

type FbqFn = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  loaded: boolean;
  version: string;
  push: unknown;
};

type TrackingWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: FbqFn;
  _fbq?: FbqFn;
  __feLoaded?: Partial<Record<TrackerKind, boolean>>;
};

const w = () => window as TrackingWindow;

function addScript(src: string) {
  const el = document.createElement("script");
  el.async = true;
  el.src = src;
  document.head.appendChild(el);
}

/** Loads whichever trackers are not loaded yet; returns the ones that were loaded just now. */
export function loadTrackers(ids: Record<TrackerKind, string | null>): Set<TrackerKind> {
  const win = w();
  win.__feLoaded = win.__feLoaded || {};
  const fresh = new Set<TrackerKind>();

  if (ids.gtm && !win.__feLoaded.gtm) {
    win.__feLoaded.gtm = true;
    fresh.add("gtm");
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    addScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(ids.gtm)}`);
  }

  if (ids.ga4 && !win.__feLoaded.ga4) {
    win.__feLoaded.ga4 = true;
    fresh.add("ga4");
    win.dataLayer = win.dataLayer || [];
    if (!win.gtag) {
      win.gtag = function gtag() {
        // gtag.js requires the real `arguments` object, not an array.
        // eslint-disable-next-line prefer-rest-params
        win.dataLayer!.push(arguments);
      };
    }
    win.gtag("js", new Date());
    win.gtag("config", ids.ga4);
    addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids.ga4)}`);
  }

  if (ids.pixel && !win.__feLoaded.pixel) {
    win.__feLoaded.pixel = true;
    fresh.add("pixel");
    if (!win.fbq) {
      const fbq = function (...args: unknown[]) {
        if (fbq.callMethod) fbq.callMethod(...args);
        else fbq.queue.push(args);
      } as FbqFn;
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      win.fbq = fbq;
      win._fbq = fbq;
      addScript("https://connect.facebook.net/en_US/fbevents.js");
    }
    win.fbq("init", ids.pixel);
    win.fbq("track", "PageView");
  }

  return fresh;
}

/** SPA navigation: the initial page view is sent by the tracker itself, later ones are manual. */
export function trackPageView(
  path: string,
  ids: Record<TrackerKind, string | null>,
  skip: Set<TrackerKind>,
) {
  const win = w();
  if (ids.ga4 && !skip.has("ga4") && win.gtag) {
    win.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
  if (ids.gtm && !skip.has("gtm")) {
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({ event: "page_view", page_path: path, page_title: document.title });
  }
  if (ids.pixel && !skip.has("pixel") && win.fbq) win.fbq("track", "PageView");
}

/** Conversion event for a submitted enquiry. Safe to call when no tracker is configured. */
export function trackLead() {
  if (typeof window === "undefined") return;
  const win = w();
  win.gtag?.("event", "generate_lead");
  win.fbq?.("track", "Lead");
  if (win.__feLoaded?.gtm) win.dataLayer?.push({ event: "generate_lead" });
}

/**
 * Inserts admin-supplied HTML (scripts included) into <head> or the end of <body>.
 * Replaces its own previous output if the admin edits the snippet; already-executed scripts
 * cannot be un-run, so such edits fully apply on the next page load.
 */
export function injectCustomHtml(html: string, target: "head" | "body") {
  const attr = `data-fe-custom-${target}`;
  const holder = target === "head" ? document.head : document.body;
  const marker = holder.querySelector(`[${attr}-marker]`) as HTMLElement | null;
  if (marker?.getAttribute(`${attr}-marker`) === html) return;
  holder.querySelectorAll(`[${attr}]`).forEach((n) => n.remove());
  marker?.remove();
  if (!html.trim()) return;

  const fragment = document.createRange().createContextualFragment(html);
  Array.from(fragment.children).forEach((child) => child.setAttribute(attr, "true"));
  const newMarker = document.createElement("meta");
  newMarker.setAttribute(`${attr}-marker`, html);
  holder.appendChild(newMarker);
  holder.appendChild(fragment);
}
