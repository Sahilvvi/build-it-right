import type { LocationRewrite } from "@tanstack/react-router";
import {
  getAdminStore,
  isStoreHydrated,
  type AdminStoreData,
  type CustomPage,
} from "./admin-store";

type PageStore = Pick<AdminStoreData, "pageSlugs" | "redirects"> &
  Partial<Pick<AdminStoreData, "customPages">>;

/**
 * Page registry.
 *
 * The site's pages are fixed React routes whose built-in address (e.g. "/cfa") is their stable
 * identity: SEO settings, menu links and analytics are all keyed on it. An admin can give any page
 * a different *public* address (e.g. "/cfa-classes"). The router `rewrite` below translates between
 * the two, so every `<Link to="/cfa">` in the codebase automatically renders the new address and a
 * request for the new address renders the same page.
 */
export interface CorePage {
  title: string;
  /** Built-in, stable address. */
  defaultPath: string;
  renamable: boolean;
}

export const CORE_PAGES: CorePage[] = [
  { title: "Home", defaultPath: "/", renamable: false },
  { title: "Courses", defaultPath: "/courses", renamable: true },
  { title: "CFA® Program Preparation", defaultPath: "/cfa", renamable: true },
  { title: "About Us", defaultPath: "/about", renamable: true },
  { title: "Resources", defaultPath: "/resources", renamable: true },
  { title: "Contact Us", defaultPath: "/contact", renamable: true },
];

/** Address prefixes a page may never take (the admin portal, API, framework internals). */
const RESERVED_FIRST_SEGMENTS = ["admin", "admin-login", "api"];

declare global {
  interface Window {
    /** Server-rendered copy of the overrides, so the router can resolve them before the store loads. */
    __PAGE_PATHS__?: Record<string, string>;
  }
}

const norm = (path: string) => {
  let p = path.trim().toLowerCase();
  if (!p.startsWith("/")) p = `/${p}`;
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
};

const split = (to: string) => {
  const i = to.search(/[?#]/);
  return i === -1 ? { base: to, rest: "" } : { base: to.slice(0, i), rest: to.slice(i) };
};

/** default path -> custom public path, only for pages the admin has renamed. */
export function pageOverrides(): Record<string, string> {
  if (typeof window !== "undefined" && !isStoreHydrated() && window.__PAGE_PATHS__) {
    return window.__PAGE_PATHS__;
  }
  return getAdminStore().pageSlugs ?? {};
}

/** "/cfa" -> "/cfa-classes" when renamed; anything else is returned unchanged. */
export function toPublicPath(path: string): string {
  const { base, rest } = split(path);
  const custom = pageOverrides()[norm(base)];
  return custom ? custom + rest : path;
}

/** "/cfa-classes" -> "/cfa" when that address belongs to a renamed page. */
export function toInternalPath(path: string): string {
  const { base, rest } = split(path);
  const target = norm(base);
  for (const [internal, custom] of Object.entries(pageOverrides())) {
    if (norm(custom) === target) return internal + rest;
  }
  return path;
}

export const pageRewrite: LocationRewrite = {
  input: ({ url }) => {
    const next = toInternalPath(url.pathname);
    if (next !== url.pathname) url.pathname = next;
    return url;
  },
  output: ({ url }) => {
    const next = toPublicPath(url.pathname);
    if (next !== url.pathname) url.pathname = next;
    return url;
  },
};

/** For hard loads of a renamed page's old built-in address: where to send the visitor. */
export function defaultToCustomRedirect(pathname: string): string | null {
  return pageOverrides()[norm(pathname)] ?? null;
}

export type SlugCheck = { ok: true; path: string | null } | { ok: false; error: string };

/**
 * Validates an address typed by an admin for the page whose built-in address is `defaultPath`.
 * `path: null` means "back to the built-in address".
 */
export function checkPageSlug(defaultPath: string, input: string, store: PageStore): SlugCheck {
  const slug = input
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
  if (!slug || norm(slug) === norm(defaultPath)) return { ok: true, path: null };

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(slug)) {
    return {
      ok: false,
      error: "Use lowercase letters, numbers and hyphens only (e.g. cfa-classes).",
    };
  }
  if (slug.length > 80) return { ok: false, error: "Address is too long (max 80 characters)." };

  const path = `/${slug}`;
  if (RESERVED_FIRST_SEGMENTS.includes(slug.split("/")[0])) {
    return { ok: false, error: `"${path}" is reserved for the system.` };
  }
  for (const page of CORE_PAGES) {
    if (page.defaultPath === defaultPath) continue;
    const effective = store.pageSlugs[page.defaultPath] || page.defaultPath;
    if (norm(effective) === norm(path) || norm(page.defaultPath) === norm(path)) {
      return { ok: false, error: `"${path}" is already used by the ${page.title} page.` };
    }
  }
  const customClash = store.customPages?.find((p) => norm(`/${p.slug}`) === norm(path));
  if (customClash) {
    return { ok: false, error: `"${path}" is already used by the page "${customClash.title}".` };
  }
  const clash = store.redirects.find(
    (r) => norm(r.fromPath) === norm(path) && !r.id.startsWith(AUTO_REDIRECT_PREFIX),
  );
  if (clash) {
    return {
      ok: false,
      error: `A redirect rule already starts at "${path}". Delete that rule first (SEO → Redirects).`,
    };
  }
  return { ok: true, path };
}

export const AUTO_REDIRECT_PREFIX = "r-auto-";

/** Every internal address a menu link may point at without producing a 404. */
export function knownInternalPaths(store: PageStore): Set<string> {
  const known = new Set<string>();
  for (const page of CORE_PAGES) {
    known.add(norm(page.defaultPath));
    const custom = store.pageSlugs[page.defaultPath];
    if (custom) known.add(norm(custom));
  }
  for (const p of store.customPages ?? [])
    if (p.status === "published") known.add(norm(`/${p.slug}`));
  for (const r of store.redirects) if (r.isActive) known.add(norm(r.fromPath));
  return known;
}

/** False only for same-site paths that match no page or redirect (external URLs are not checked). */
export function linkTargetExists(to: string, store: PageStore): boolean {
  const t = to.trim();
  if (!t.startsWith("/") || t.startsWith("//")) return true;
  return knownInternalPaths(store).has(norm(split(t).base));
}

// ---------------------------------------------------------------- custom (admin-created) pages

export const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/** Normalise a slug as typed: lowercase, no surrounding slashes. */
export const cleanSlug = (raw: string) =>
  raw
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

export function findCustomPage(
  slugOrPath: string | undefined,
  pages: CustomPage[],
  includeHidden = false,
): CustomPage | null {
  const slug = cleanSlug(slugOrPath ?? "");
  if (!slug) return null;
  return pages.find((p) => p.slug === slug && (includeHidden || p.status === "published")) ?? null;
}

export type CustomSlugCheck = { ok: true; slug: string } | { ok: false; error: string };

/** Validates the address of a custom page. `currentId` is the page being edited (null for new). */
export function checkCustomPageSlug(
  input: string,
  currentId: string | null,
  store: PageStore,
): CustomSlugCheck {
  const slug = cleanSlug(input);
  if (!slug) return { ok: false, error: "Enter a web address for this page." };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(slug)) {
    return {
      ok: false,
      error: "Use lowercase letters, numbers and hyphens only (e.g. privacy-policy).",
    };
  }
  if (slug.length > 80) return { ok: false, error: "Address is too long (max 80 characters)." };
  const path = `/${slug}`;
  if (RESERVED_FIRST_SEGMENTS.includes(slug.split("/")[0])) {
    return { ok: false, error: `"${path}" is reserved for the system.` };
  }
  for (const page of CORE_PAGES) {
    const effective = store.pageSlugs[page.defaultPath] || page.defaultPath;
    if (norm(effective) === norm(path) || norm(page.defaultPath) === norm(path)) {
      return { ok: false, error: `"${path}" is already used by the ${page.title} page.` };
    }
  }
  const other = store.customPages?.find((p) => p.id !== currentId && p.slug === slug);
  if (other) return { ok: false, error: `"${path}" is already used by "${other.title}".` };
  const clash = store.redirects.find(
    (r) => norm(r.fromPath) === norm(path) && !r.id.startsWith(AUTO_REDIRECT_PREFIX),
  );
  if (clash) {
    return {
      ok: false,
      error: `A redirect rule already starts at "${path}". Delete that rule first (SEO → Redirects).`,
    };
  }
  return { ok: true, slug };
}
