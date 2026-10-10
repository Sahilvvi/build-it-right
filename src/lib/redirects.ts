import type { RedirectRule } from "./admin-store";
import { toPublicPath } from "./pages";

const normalise = (path: string) => {
  let p = path.split("?")[0].split("#")[0].toLowerCase();
  if (p.length > 1) p = p.replace(/\/+$/, "");
  return p || "/";
};

/** Only same-site paths and absolute http(s) URLs are valid destinations. */
export function isValidRedirectTarget(to: string): boolean {
  const t = to.trim();
  return (t.startsWith("/") && !t.startsWith("//")) || /^https?:\/\/\S+$/i.test(t);
}

export function isExternalTarget(to: string): boolean {
  return /^https?:\/\//i.test(to.trim());
}

export function matchRedirect(pathname: string, rules: RedirectRule[]): RedirectRule | null {
  const target = normalise(pathname);
  return (
    rules.find(
      (r) =>
        r.isActive &&
        isValidRedirectTarget(r.toPath) &&
        normalise(r.fromPath) === target &&
        (isExternalTarget(r.toPath) || normalise(r.toPath) !== target),
    ) ?? null
  );
}

/** Destination including the original query string (internal targets without their own query). */
export function redirectDestination(rule: RedirectRule, search: string): string {
  const to = rule.toPath.trim();
  if (isExternalTarget(to)) return to;
  if (to.includes("?")) return toPublicPath(to);
  return `${toPublicPath(to)}${search}`;
}

/** True when adding from→to would create a loop (directly or through existing rules). */
export function wouldLoop(from: string, to: string, rules: RedirectRule[]): boolean {
  if (isExternalTarget(to)) return false;
  const start = normalise(from);
  let next = normalise(to);
  const seen = new Set<string>();
  while (!seen.has(next)) {
    if (next === start) return true;
    seen.add(next);
    const hop = rules.find((r) => r.isActive && normalise(r.fromPath) === next);
    if (!hop || isExternalTarget(hop.toPath)) return false;
    next = normalise(hop.toPath);
  }
  return true;
}

// ---- server-side rule cache (used by the request middleware in start.ts) ----

const TTL_MS = 30_000;
let cache: { at: number; rules: RedirectRule[] } | null = null;

/** Rules change rarely, so each server instance re-reads them at most every 30 s. */
export async function getRedirectRules(): Promise<RedirectRule[]> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.rules;
  const { loadPublicContent, getAdminStore } = await import("./admin-store");
  try {
    await loadPublicContent();
    cache = { at: Date.now(), rules: getAdminStore().redirects };
  } catch (err) {
    console.error("Could not refresh redirect rules:", err);
    cache = { at: Date.now(), rules: cache?.rules ?? [] };
  }
  return cache.rules;
}
