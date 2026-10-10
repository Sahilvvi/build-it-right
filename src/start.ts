import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { getRedirectRules, matchRedirect, redirectDestination } from "./lib/redirects";
import { defaultToCustomRedirect } from "./lib/pages";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Admin → SEO → Redirect Rules. Answers with a real 301/302 before any page renders.
const redirectMiddleware = createMiddleware().server(async ({ next, request, pathname }) => {
  const skip =
    (request.method !== "GET" && request.method !== "HEAD") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_") ||
    pathname.startsWith("/api") ||
    /\.[a-z0-9]+$/i.test(pathname);
  if (skip) return next();

  try {
    const rule = matchRedirect(pathname, await getRedirectRules());
    const search = new URL(request.url).search;

    // A renamed page keeps working at its old built-in address: send visitors to the new one.
    const renamedTo = rule ? null : defaultToCustomRedirect(pathname);
    if (renamedTo) {
      return new Response(null, {
        status: 301,
        headers: { Location: `${renamedTo}${search}`, "Cache-Control": "no-store" },
      });
    }

    if (rule) {
      return new Response(null, {
        status: rule.statusCode,
        headers: { Location: redirectDestination(rule, search), "Cache-Control": "no-store" },
      });
    }
  } catch (error) {
    // A redirect lookup must never take the site down.
    console.error("Redirect middleware failed:", error);
  }
  return next();
});

export const startInstance = createStart(() => ({
  requestMiddleware: [errorMiddleware, redirectMiddleware],
}));
