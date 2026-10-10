import { createFileRoute } from "@tanstack/react-router";
import { getAdminStore, loadPublicContent } from "@/lib/admin-store";
import { CORE_PAGES, toPublicPath } from "@/lib/pages";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        await loadPublicContent(30_000);
        const store = getAdminStore();
        const origin = (
          (import.meta.env.VITE_SITE_URL as string | undefined)?.trim() ||
          new URL(request.url).origin
        ).replace(/\/+$/, "");

        const paths = [
          ...CORE_PAGES.map((p) => toPublicPath(p.defaultPath)),
          ...store.customPages.filter((p) => p.status === "published").map((p) => `/${p.slug}`),
        ];
        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          paths.map((p) => `  <url><loc>${esc(origin + p)}</loc></url>`).join("\n") +
          `\n</urlset>\n`;
        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=300, s-maxage=300",
          },
        });
      },
    },
  },
});
