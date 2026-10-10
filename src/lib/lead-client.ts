import { submitLeadFn } from "./leads";
import { getAdminStore } from "./admin-store";
import { trackLead } from "./tracking";

export interface LeadPayload {
  kind?: "enquiry" | "newsletter";
  name?: string;
  email: string;
  phone?: string;
  interest?: string;
  message?: string;
  /** Honeypot field value (must stay empty for real visitors). */
  website?: string;
  /** When the form was first displayed (Date.now()). */
  startedAt?: number;
  turnstileToken?: string;
}

/** A problem the visitor should see (rate limit, failed verification…). */
export class LeadError extends Error {}

const FRIENDLY = /too many|verification|whatsapp|required|valid/i;

/**
 * Sends an enquiry to the server (CRM + email alert). If the server is not configured yet, the
 * enquiry still reaches the team through a backup email service so no lead is ever lost.
 */
export async function submitLead(payload: LeadPayload): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const input = {
    ...payload,
    sourcePage: window.location.pathname,
    utmSource: params.get("utm_source") || "website_direct",
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmTerm: params.get("utm_term") || undefined,
    utmContent: params.get("utm_content") || undefined,
  };

  try {
    await submitLeadFn({ data: input });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    // Server-side validation failures arrive as a JSON list of issues: never show that raw.
    if (message.trim().startsWith("[")) {
      throw new LeadError("Please check your name, email and phone number and try again.");
    }
    if (FRIENDLY.test(message)) throw new LeadError(message);

    console.error("Lead server unavailable, using the backup email path:", err);
    const to = getAdminStore().identity.email || "contactfinenvision@gmail.com";
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        Name: payload.name,
        Email: payload.email,
        Phone: payload.phone,
        Interest: payload.interest,
        Message: payload.message,
        _subject:
          payload.kind === "newsletter"
            ? "New Newsletter Subscription - Fin-Envision"
            : "New Career Guidance Booking - Fin-Envision",
      }),
    });
    if (!res.ok) throw new LeadError("We could not send your details. Please WhatsApp us instead.");
  }
  trackLead();
}
