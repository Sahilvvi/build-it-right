import { getAdminStore } from "./admin-store";
import { toPublicPath } from "./pages";

type MetaEntry = {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
  charSet?: string;
};
type LinkEntry = { rel: string; href: string; [key: string]: string | undefined };

/** Public origin of the site (e.g. https://finenvision.com). Needed for absolute og:image / canonical. */
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.trim().replace(/\/+$/, "");

export function absoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url) || !SITE_URL) return url;
  return `${SITE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export function siteOrigin(): string | undefined {
  return SITE_URL || undefined;
}

const metaKey = (m: MetaEntry) =>
  m.title !== undefined
    ? "title"
    : m.name
      ? `name:${m.name}`
      : m.property
        ? `property:${m.property}`
        : JSON.stringify(m);

/**
 * Overlays the admin's SEO settings (Admin → SEO) for `path` on top of a route's built-in head.
 * Blank admin fields fall back to the route's own values, so nothing is ever left untitled.
 */
export function withSeo(
  path: string,
  base: { meta: MetaEntry[]; links?: LinkEntry[] },
): { meta: MetaEntry[]; links: LinkEntry[] } {
  const seo = getAdminStore().seo[path];
  const overrides: MetaEntry[] = [];

  const title = seo?.title?.trim();
  if (title) {
    overrides.push(
      { title },
      { property: "og:title", content: title },
      { name: "twitter:title", content: title },
    );
  }
  const description = seo?.description?.trim();
  if (description) {
    overrides.push(
      { name: "description", content: description },
      { property: "og:description", content: description },
      { name: "twitter:description", content: description },
    );
  }
  const ogImage = seo?.ogImage?.trim();
  if (ogImage) {
    const abs = absoluteUrl(ogImage);
    overrides.push({ property: "og:image", content: abs }, { name: "twitter:image", content: abs });
  }

  const canonical =
    seo?.canonicalUrl?.trim() || (SITE_URL ? absoluteUrl(toPublicPath(path)) : undefined);
  if (canonical) overrides.push({ property: "og:url", content: canonical });

  const overridden = new Set(overrides.map(metaKey));
  const meta = [...base.meta.filter((m) => !overridden.has(metaKey(m))), ...overrides];

  let links = base.links ?? [];
  if (canonical) {
    links = [...links.filter((l) => l.rel !== "canonical"), { rel: "canonical", href: canonical }];
  }
  return { meta, links };
}

/** Google Search Console accepts a bare token, `google-site-verification=…`, or the full <meta> tag. */
export function parseSearchConsoleToken(raw: string | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  const fromTag = value.match(/content\s*=\s*["']([^"']+)["']/i)?.[1];
  const token = (fromTag ?? value).replace(/^google-site-verification=/i, "").trim();
  if (!token || /SAMPLE|X{6,}/i.test(token)) return null;
  return token;
}
