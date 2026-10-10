import type { ReactNode } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { recordSection } from "@/lib/editable/patch";

/**
 * Marks a top-level block of a page so an admin can show or hide it from the site editor.
 * `id` must stay stable ("home.faq"): it is what is saved when a section is hidden.
 */
export function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  const { hiddenSections } = useAdminStore();
  recordSection(id, label);
  if (hiddenSections.includes(id)) return null;
  return <>{children}</>;
}
