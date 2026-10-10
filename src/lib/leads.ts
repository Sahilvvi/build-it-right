import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

/**
 * Public lead capture. Visitors cannot write to the database directly (Row Level Security blocks
 * it); they call this server function, which defends against spam and then inserts with the
 * service role and notifies the team by email.
 */

const MAX_PER_HOUR = 5;
const MIN_FILL_MS = 2500;

const leadInput = z
  .object({
    kind: z.enum(["enquiry", "newsletter"]).default("enquiry"),
    name: z.string().trim().max(80).optional(),
    email: z.string().trim().email().max(200),
    phone: z.string().trim().max(20).optional(),
    message: z.string().trim().max(1000).optional(),
    interest: z.string().trim().max(120).optional(),
    sourcePage: z.string().trim().max(200).optional(),
    utmSource: z.string().trim().max(120).optional(),
    utmMedium: z.string().trim().max(120).optional(),
    utmCampaign: z.string().trim().max(120).optional(),
    utmTerm: z.string().trim().max(120).optional(),
    utmContent: z.string().trim().max(120).optional(),
    /** Honeypot: real people never fill this hidden field. */
    website: z.string().max(200).optional(),
    /** Epoch ms when the form was first shown, to reject instant bot submissions. */
    startedAt: z.number().optional(),
    turnstileToken: z.string().max(4096).optional(),
  })
  .refine(
    (d) => d.kind === "newsletter" || ((d.name?.length ?? 0) >= 2 && (d.phone?.length ?? 0) >= 7),
    {
      message: "Name and phone are required.",
    },
  );

function serviceClient(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("The server is not configured to accept enquiries yet.");
  return createClient(url, key, { auth: { persistSession: false } });
}

async function sha256(value: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function verifyTurnstile(
  token: string | undefined,
  ip: string | undefined,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // captcha is optional until a key is configured
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
    });
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}

type SmtpRow = {
  leadNotificationEmail?: string;
  sendLeadAlerts?: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  senderName?: string;
};

async function loadSmtp(service: SupabaseClient): Promise<SmtpRow> {
  const { data } = await service
    .from("site_content")
    .select("data")
    .eq("id", "private")
    .maybeSingle();
  return ((data?.data as { smtp?: SmtpRow } | null)?.smtp ?? {}) as SmtpRow;
}

export const submitLeadFn = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => leadInput.parse(raw))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    // Bots: silently pretend success so they learn nothing.
    if (data.website && data.website.trim()) return { ok: true };
    if (data.startedAt && Date.now() - data.startedAt < MIN_FILL_MS) return { ok: true };

    const { getRequestIP } = await import("@tanstack/react-start/server");
    const ip = getRequestIP({ xForwardedFor: true }) ?? undefined;

    if (!(await verifyTurnstile(data.turnstileToken, ip))) {
      throw new Error("Please complete the verification and try again.");
    }

    const service = serviceClient();
    const ipHash = await sha256(`${ip ?? "unknown"}|${process.env.SUPABASE_SERVICE_ROLE_KEY}`);

    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count } = await service
      .from("lead_submissions")
      .select("id", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", since);
    if ((count ?? 0) >= MAX_PER_HOUR) {
      throw new Error("Too many enquiries from your connection. Please WhatsApp us instead.");
    }
    await service.from("lead_submissions").insert({ ip_hash: ipHash });
    if (Math.random() < 0.05) {
      await service
        .from("lead_submissions")
        .delete()
        .lt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
    }

    const createdAt = new Date().toISOString();
    const newsletter = data.kind === "newsletter";
    const lead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: data.name || "Newsletter subscriber",
      email: data.email,
      phone: data.phone || "-",
      courseInterest: newsletter
        ? "Newsletter subscription"
        : data.interest || "Chartered Financial Analyst (CFA®) Level 1",
      leadStage: "Inquiry",
      city: "Mumbai",
      sourcePage: data.sourcePage || "/contact",
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmTerm: data.utmTerm,
      utmContent: data.utmContent,
      createdAt,
      notes: data.message
        ? [
            {
              id: `note-${Date.now()}`,
              author: "Website visitor",
              text: data.message,
              createdAt,
            },
          ]
        : [],
    };
    const { error } = await service
      .from("leads")
      .insert({ id: lead.id, data: lead, created_at: createdAt });
    if (error) throw new Error("We could not save your enquiry. Please try WhatsApp instead.");

    // Email alert: best effort. A mail problem must never lose or fail the lead.
    try {
      const smtp = await loadSmtp(service);
      if (smtp.sendLeadAlerts && smtp.leadNotificationEmail) {
        const { sendMail } = await import("./mailer.server");
        await sendMail(
          {
            host: smtp.smtpHost ?? "",
            port: smtp.smtpPort ?? 587,
            user: smtp.smtpUser ?? "",
            senderName: smtp.senderName || "Fin-Envision Portal",
          },
          {
            to: smtp.leadNotificationEmail,
            replyTo: lead.email,
            subject: newsletter
              ? `New newsletter subscriber: ${lead.email}`
              : `New enquiry: ${lead.name} (${lead.courseInterest})`,
            text: [
              newsletter
                ? "Someone subscribed to the newsletter."
                : "A new enquiry just came in from the website.",
              data.message
                ? `
Message: ${data.message}
`
                : "",
              "",
              `Name:     ${lead.name}`,
              `Phone:    ${lead.phone}`,
              `Email:    ${lead.email}`,
              `Interest: ${lead.courseInterest}`,
              `Page:     ${lead.sourcePage}`,
              lead.utmSource
                ? `Source:   ${lead.utmSource} / ${lead.utmMedium ?? "-"} / ${lead.utmCampaign ?? "-"}`
                : "",
              "",
              "Open the admin portal → Candidate Leads CRM to follow up.",
            ]
              .filter((l, i, a) => l !== "" || a[i - 1] !== "")
              .join("\n"),
          },
        );
      }
    } catch (err) {
      console.error("Lead alert email failed:", err instanceof Error ? err.message : err);
    }

    return { ok: true };
  });

const testInput = z.object({ accessToken: z.string().min(10) });

/** Super Admin only: sends a test message with the saved SMTP settings and reports the real result. */
export const sendTestEmailFn = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => testInput.parse(raw))
  .handler(async ({ data }): Promise<{ sentTo: string }> => {
    const service = serviceClient();
    const { data: caller } = await service.auth.getUser(data.accessToken);
    if (!caller.user) throw new Error("Not authenticated.");
    const { data: profile } = await service
      .from("admin_profiles")
      .select("role, status")
      .eq("user_id", caller.user.id)
      .maybeSingle();
    if (profile?.role !== "super_admin" || profile.status !== "active") {
      throw new Error("Only a Super Admin can send a test email.");
    }

    const smtp = await loadSmtp(service);
    if (!smtp.leadNotificationEmail)
      throw new Error("Set and save a notification recipient first.");
    const { sendMail } = await import("./mailer.server");
    await sendMail(
      {
        host: smtp.smtpHost ?? "",
        port: smtp.smtpPort ?? 587,
        user: smtp.smtpUser ?? "",
        senderName: smtp.senderName || "Fin-Envision Portal",
      },
      {
        to: smtp.leadNotificationEmail,
        subject: "Test email from your Fin-Envision admin portal",
        text: "If you can read this, lead alert emails are configured correctly.",
      },
    );
    return { sentTo: smtp.leadNotificationEmail };
  });
