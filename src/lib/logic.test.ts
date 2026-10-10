import { beforeEach, describe, expect, it } from "vitest";
import { isValidLinkTarget, needsPlainAnchor, normalisePath } from "./links";
import { isValidRedirectTarget, matchRedirect, redirectDestination, wouldLoop } from "./redirects";
import { cleanTrackingId } from "./tracking";
import { parseSearchConsoleToken } from "./seo";
import {
  checkCustomPageSlug,
  checkPageSlug,
  cleanSlug,
  findCustomPage,
  knownInternalPaths,
  linkTargetExists,
  slugify,
} from "./pages";
import { normaliseSrc } from "./editable/patch";
import { youtubeId } from "../components/site/CustomPageView";
import type { CustomPage, RedirectRule } from "./admin-store";

const rule = (from: string, to: string, extra: Partial<RedirectRule> = {}): RedirectRule => ({
  id: `r-${from}`,
  fromPath: from,
  toPath: to,
  statusCode: 301,
  isActive: true,
  ...extra,
});

const page = (slug: string, extra: Partial<CustomPage> = {}): CustomPage => ({
  id: `p-${slug}`,
  title: slug,
  slug,
  status: "published",
  blocks: [],
  seoTitle: "",
  seoDescription: "",
  ogImage: "",
  createdAt: "",
  updatedAt: "",
  ...extra,
});

describe("link targets", () => {
  it("accepts site paths and safe schemes", () => {
    for (const ok of [
      "/",
      "/about",
      "/#faq",
      "https://a.com/x",
      "mailto:a@b.co",
      "tel:+911234567890",
    ]) {
      expect(isValidLinkTarget(ok), ok).toBe(true);
    }
  });
  it("rejects script, data and protocol-relative targets", () => {
    for (const bad of [
      "javascript:alert(1)",
      "data:text/html,x",
      "//evil.com",
      "",
      "  ",
      "ftp://x.com",
      "about",
    ]) {
      expect(isValidLinkTarget(bad), bad).toBe(false);
    }
  });
  it("uses a plain anchor for external, hash and query targets", () => {
    expect(needsPlainAnchor("/about")).toBe(false);
    expect(needsPlainAnchor("/#faq")).toBe(true);
    expect(needsPlainAnchor("/a?x=1")).toBe(true);
    expect(needsPlainAnchor("https://x.com")).toBe(true);
  });
  it("normalises paths", () => {
    expect(normalisePath("/about/")).toBe("/about");
    expect(normalisePath("/about?x=1#y")).toBe("/about");
    expect(normalisePath("/")).toBe("/");
  });
});

describe("redirects", () => {
  it("matches case-insensitively and ignores a trailing slash", () => {
    expect(matchRedirect("/Old-Page/", [rule("/old-page", "/cfa")])?.toPath).toBe("/cfa");
  });
  it("ignores paused rules, bad targets and self-redirects", () => {
    expect(matchRedirect("/a", [rule("/a", "/b", { isActive: false })])).toBeNull();
    expect(matchRedirect("/a", [rule("/a", "javascript:x")])).toBeNull();
    expect(matchRedirect("/a", [rule("/a", "/a")])).toBeNull();
  });
  it("keeps the query string for internal targets only", () => {
    expect(redirectDestination(rule("/a", "/b"), "?utm=1")).toBe("/b?utm=1");
    expect(redirectDestination(rule("/a", "https://x.org/p"), "?utm=1")).toBe("https://x.org/p");
  });
  it("detects direct and chained loops", () => {
    expect(wouldLoop("/a", "/b", [rule("/b", "/a")])).toBe(true);
    expect(wouldLoop("/a", "/b", [rule("/b", "/c"), rule("/c", "/a")])).toBe(true);
    expect(wouldLoop("/a", "/b", [rule("/b", "/c")])).toBe(false);
    expect(wouldLoop("/a", "https://x.org", [])).toBe(false);
  });
  it("validates redirect targets", () => {
    expect(isValidRedirectTarget("/x")).toBe(true);
    expect(isValidRedirectTarget("https://x.org")).toBe(true);
    expect(isValidRedirectTarget("//x.org")).toBe(false);
    expect(isValidRedirectTarget("javascript:1")).toBe(false);
  });
});

describe("tracking ids and Search Console tokens", () => {
  it("accepts real IDs and rejects placeholders", () => {
    expect(cleanTrackingId("ga4", "G-ABC12345")).toBe("G-ABC12345");
    expect(cleanTrackingId("ga4", "G-XXXXXXXXXX")).toBeNull();
    expect(cleanTrackingId("gtm", " GTM-ABCD12 ")).toBe("GTM-ABCD12");
    expect(cleanTrackingId("gtm", "GTM-XXXXXXX")).toBeNull();
    expect(cleanTrackingId("pixel", "123456789012345")).toBe("123456789012345");
    expect(cleanTrackingId("pixel", "abc")).toBeNull();
    expect(cleanTrackingId("ga4", "")).toBeNull();
  });
  it("extracts the token from every accepted paste format", () => {
    expect(parseSearchConsoleToken("abc123")).toBe("abc123");
    expect(parseSearchConsoleToken("google-site-verification=abc123")).toBe("abc123");
    expect(
      parseSearchConsoleToken('<meta name="google-site-verification" content="abc123" />'),
    ).toBe("abc123");
    expect(parseSearchConsoleToken("google-site-verification=SAMPLE_TOKEN_HERE")).toBeNull();
    expect(parseSearchConsoleToken("   ")).toBeNull();
  });
});

describe("page addresses", () => {
  const store = {
    pageSlugs: { "/cfa": "/cfa-classes" },
    redirects: [rule("/promo", "/courses")],
    customPages: [page("privacy")],
  };

  it("accepts a clean new address and resets on blank / built-in", () => {
    expect(checkPageSlug("/about", "our-story", store)).toEqual({ ok: true, path: "/our-story" });
    expect(checkPageSlug("/about", "", store)).toEqual({ ok: true, path: null });
    expect(checkPageSlug("/about", "/about", store)).toEqual({ ok: true, path: null });
  });
  it("rejects bad characters, reserved prefixes and collisions", () => {
    expect(checkPageSlug("/about", "Our Story!", store).ok).toBe(false);
    expect(checkPageSlug("/about", "admin/x", store).ok).toBe(false);
    expect(checkPageSlug("/about", "contact", store).ok).toBe(false); // another page's built-in address
    expect(checkPageSlug("/about", "cfa-classes", store).ok).toBe(false); // another page's custom address
    expect(checkPageSlug("/about", "privacy", store).ok).toBe(false); // a page you created
    expect(checkPageSlug("/about", "promo", store).ok).toBe(false); // a manual redirect starts there
  });
  it("validates custom page slugs and allows keeping your own", () => {
    expect(checkCustomPageSlug("terms", null, store)).toEqual({ ok: true, slug: "terms" });
    expect(checkCustomPageSlug("legal/terms", null, store)).toEqual({
      ok: true,
      slug: "legal/terms",
    });
    expect(checkCustomPageSlug("privacy", "p-privacy", store).ok).toBe(true);
    expect(checkCustomPageSlug("privacy", null, store).ok).toBe(false);
    expect(checkCustomPageSlug("", null, store).ok).toBe(false);
    expect(checkCustomPageSlug("about", null, store).ok).toBe(false);
    expect(checkCustomPageSlug("api/x", null, store).ok).toBe(false);
  });
  it("slugifies titles", () => {
    expect(slugify("Terms & Conditions")).toBe("terms-and-conditions");
    expect(slugify("  Hello,  World!  ")).toBe("hello-world");
    expect(cleanSlug("/Privacy/")).toBe("privacy");
  });
  it("finds only published pages unless previewing", () => {
    const pages = [page("a"), page("b", { status: "hidden" })];
    expect(findCustomPage("a", pages)?.slug).toBe("a");
    expect(findCustomPage("b", pages)).toBeNull();
    expect(findCustomPage("b", pages, true)?.slug).toBe("b");
    expect(findCustomPage("/A/", pages)?.slug).toBe("a");
  });
  it("knows which same-site paths exist", () => {
    expect(knownInternalPaths(store).has("/cfa-classes")).toBe(true);
    expect(linkTargetExists("/about", store)).toBe(true);
    expect(linkTargetExists("/privacy", store)).toBe(true);
    expect(linkTargetExists("/promo", store)).toBe(true);
    expect(linkTargetExists("/nope", store)).toBe(false);
    expect(linkTargetExists("https://elsewhere.org", store)).toBe(true);
  });
});

describe("editable text layer", () => {
  it("makes build-hashed image names stable", () => {
    expect(normaliseSrc("/assets/hero-classroom-DxK9a_3b.jpg")).toBe("hero-classroom.jpg");
    expect(normaliseSrc("/manoj-rajgopal.jpg")).toBe("manoj-rajgopal.jpg");
    expect(normaliseSrc("https://i.ytimg.com/vi/ABC/hqdefault.jpg?x=1")).toBe("hqdefault.jpg");
  });
});

describe("youtube links", () => {
  it("extracts the video id from common formats", () => {
    for (const u of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtu.be/dQw4w9WgXcQ",
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/shorts/dQw4w9WgXcQ",
      "https://www.youtube.com/watch?feature=share&v=dQw4w9WgXcQ",
    ]) {
      expect(youtubeId(u), u).toBe("dQw4w9WgXcQ");
    }
    expect(youtubeId("https://example.com/video")).toBeNull();
    expect(youtubeId("")).toBeNull();
  });
});

beforeEach(() => {
  // pure-logic tests: nothing to reset, kept for future store-backed cases
});
