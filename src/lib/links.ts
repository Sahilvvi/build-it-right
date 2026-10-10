/** Site path ("/about"), or an absolute http(s):// / mailto: / tel: URL. Blocks javascript:, data:, "//host". */
export function isValidLinkTarget(to: string | undefined): boolean {
  const t = (to ?? "").trim();
  if (!t) return false;
  if (t.startsWith("/")) return !t.startsWith("//");
  return /^(https?:\/\/|mailto:|tel:)\S+$/i.test(t);
}

/** Needs a plain <a> instead of the router <Link>: other origins, mail/tel, or hash/query targets. */
export function needsPlainAnchor(to: string): boolean {
  return !to.startsWith("/") || to.includes("#") || to.includes("?");
}

export function isHttpUrl(to: string): boolean {
  return /^https?:\/\//i.test(to.trim());
}

export function normalisePath(path: string): string {
  const p = path.split("#")[0].split("?")[0];
  return p.length > 1 ? p.replace(/\/+$/, "") : p || "/";
}
