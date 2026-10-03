import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCurrentAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    // If not authenticated in client, redirect to admin-login
    if (typeof window !== "undefined") {
      const user = getCurrentAdmin();
      if (!user) {
        throw redirect({ to: "/admin-login" });
      }
    }
  },
  component: AdminLayoutRoute,
});

function AdminLayoutRoute() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
