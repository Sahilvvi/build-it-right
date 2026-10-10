import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { AdminUser } from "./admin-store";

const input = z.object({
  accessToken: z.string().min(10),
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(200),
  password: z.string().min(8, "Password must be at least 8 characters.").max(72),
  role: z.enum(["super_admin", "admin"]),
});

/**
 * Creates a Supabase Auth user + admin_profiles row. Needs the service-role key, so it runs
 * on the server only, and refuses unless the caller's own token belongs to an active super admin.
 */
export const createAdminUserFn = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => input.parse(raw))
  .handler(async ({ data }): Promise<AdminUser> => {
    const url = import.meta.env.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) {
      throw new Error("Server is missing SUPABASE_SERVICE_ROLE_KEY.");
    }
    const service = createClient(url, serviceKey, { auth: { persistSession: false } });

    const { data: caller, error: callerError } = await service.auth.getUser(data.accessToken);
    if (callerError || !caller.user) throw new Error("Not authenticated.");

    const { data: callerProfile } = await service
      .from("admin_profiles")
      .select("role, status")
      .eq("user_id", caller.user.id)
      .maybeSingle();
    if (callerProfile?.role !== "super_admin" || callerProfile.status !== "active") {
      throw new Error("Only an active Super Admin can add administrators.");
    }

    const { data: created, error: createError } = await service.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (createError || !created.user) {
      throw new Error(createError?.message ?? "Could not create the user.");
    }

    const { error: profileError } = await service.from("admin_profiles").insert({
      user_id: created.user.id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    if (profileError) {
      await service.auth.admin.deleteUser(created.user.id);
      throw new Error(profileError.message);
    }

    return {
      id: created.user.id,
      name: data.name,
      email: data.email,
      role: data.role,
      status: "active",
    };
  });
