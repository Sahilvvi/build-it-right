import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Fragment, useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { loadPublicContent, getAdminStore, hydratePublicContent } from "@/lib/admin-store";
import { absoluteUrl, parseSearchConsoleToken, siteOrigin } from "@/lib/seo";
import { isExternalTarget, matchRedirect, redirectDestination } from "@/lib/redirects";
import { Tracking } from "@/components/site/Tracking";
import { PreviewBar } from "@/components/site/PreviewBar";
import { EditToolbar } from "@/components/site/EditToolbar";
import { usePageEpoch } from "@/lib/editable/epoch";
import { pageOverrides } from "@/lib/pages";
const faviconAsset = { url: "/finenvision-icon.png" };
const ogAsset = { url: "/finenvision-logo.png" };

function NotFoundComponent() {
  const router = useRouter();

  // Hard loads are redirected by the server middleware; this covers in-app navigation.
  useEffect(() => {
    const { pathname, search } = window.location;
    const rule = matchRedirect(pathname, getAdminStore().redirects);
    if (!rule) return;
    const destination = redirectDestination(rule, search);
    if (isExternalTarget(destination)) window.location.replace(destination);
    else router.history.replace(destination);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error("Application error:", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async () => {
    // Also applies the content to the store, so every route's head() sees the live settings.
    const publicContent = await loadPublicContent();
    return { publicContent };
  },
  head: () => {
    const store = getAdminStore();
    const home = store.seo["/"];
    const title =
      home?.title?.trim() || "Fin-Envision Learning — Master Financial Modelling & Crack the CFA®";
    const description =
      home?.description?.trim() ||
      "Fin-Envision is a leading finance training institute helping students master financial modelling and crack the CFA® with clarity and confidence.";
    const image = absoluteUrl(home?.ogImage?.trim() || ogAsset.url);
    const icon = store.visuals?.iconUrl || faviconAsset.url;
    const verification = parseSearchConsoleToken(store.tracking?.searchConsoleToken);
    const { identity } = store;
    const sameAs = store.footer.socials
      .filter((so) => so.isActive && so.platform !== "whatsapp" && /^https?:\/\//i.test(so.url))
      .map((so) => so.url);

    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title },
        { name: "description", content: description },
        { property: "og:site_name", content: identity.name || "Fin-Envision Learning" },
        { property: "og:type", content: "website" },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: image },
        { name: "theme-color", content: "#006DDA" },
        ...(verification ? [{ name: "google-site-verification", content: verification }] : []),
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/png", href: icon },
        { rel: "apple-touch-icon", href: icon },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap",
        },
      ],
      scripts: [
        // Lets the client router resolve renamed page addresses before the store has loaded.
        ...(Object.keys(pageOverrides()).length
          ? [
              {
                children: `window.__PAGE_PATHS__=${JSON.stringify(pageOverrides()).replace(/</g, "\\u003c")};`,
              },
            ]
          : []),
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            name: identity.name || "Fin-Envision Learning",
            url: siteOrigin() ?? "/",
            description: identity.tagline || "Finance training. CFA® mastery. Career clarity.",
            logo: absoluteUrl(store.visuals?.logoUrl || ogAsset.url),
            email: identity.email || undefined,
            telephone: identity.phone || undefined,
            sameAs,
          }),
        },
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Remounts the page when the site editor changes copy, so static text re-renders. */
function PageRemount() {
  const epoch = usePageEpoch();
  return (
    <Fragment key={epoch}>
      <Outlet />
    </Fragment>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { publicContent } = Route.useLoaderData();
  // Must run before any child renders so SSR and hydration both see live CMS content.
  hydratePublicContent(publicContent);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <PageRemount />
      <Tracking />
      <PreviewBar />
      <EditToolbar />
    </QueryClientProvider>
  );
}
