import { createFileRoute, notFound } from "@tanstack/react-router";
import { CustomPageView } from "@/components/site/CustomPageView";
import {
  getCurrentAdmin,
  getAdminStore,
  loadPublicContent,
  useAdminStore,
} from "@/lib/admin-store";
import { findCustomPage } from "@/lib/pages";
import { customPageHead } from "@/lib/seo";

/**
 * Catch-all for pages created in Admin → Pages. Built-in routes (/about, /cfa, …) always win;
 * anything else is looked up in the CMS and 404s if no published page has that address.
 * A signed-in admin can also open hidden pages here to preview them.
 */
const canPreview = () => typeof window !== "undefined" && !!getCurrentAdmin();

export const Route = createFileRoute("/$")({
  loader: async ({ params }) => {
    await loadPublicContent(15_000);
    const page = findCustomPage(params._splat, getAdminStore().customPages, canPreview());
    if (!page) throw notFound();
    return { pageId: page.id };
  },
  head: ({ params }) => {
    const page = findCustomPage(params._splat, getAdminStore().customPages, canPreview());
    return page ? customPageHead(page) : {};
  },
  component: CustomPageRoute,
});

function CustomPageRoute() {
  const { _splat } = Route.useParams();
  const { customPages } = useAdminStore();
  const page = findCustomPage(_splat, customPages, canPreview());
  if (!page) return null;
  return <CustomPageView page={page} preview={page.status === "hidden"} />;
}
