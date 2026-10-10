import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = (
          (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() ||
          new URL(request.url).origin
        ).replace(/\/+$/, "");
        const body = [
          "User-agent: *",
          "Disallow: /admin",
          "Disallow: /admin-login",
          "",
          `Sitemap: ${origin}/sitemap.xml`,
          "",
        ].join("\n");
        return new Response(body, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
