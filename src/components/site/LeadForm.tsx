import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useAdminStore } from "@/lib/admin-store";
import { LeadError, submitLead } from "@/lib/lead-client";
import { Turnstile, turnstileEnabled } from "./Turnstile";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  interest: z.string().max(80).optional(),
});

export function LeadForm({
  compact = false,
  defaultInterest,
}: {
  compact?: boolean;
  defaultInterest?: string;
}) {
  const { courses } = useAdminStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [token, setToken] = useState("");
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const onToken = useCallback((t: string) => setToken(t), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      interest: fd.get("interest") ?? defaultInterest,
    });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[i.path[0] as string] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setFormError("");
    if (turnstileEnabled && !token) {
      setFormError("Please complete the verification below.");
      return;
    }

    setSending(true);
    try {
      await submitLead({
        ...parsed.data,
        website: String(fd.get("website") ?? ""),
        startedAt: startedAt.current,
        turnstileToken: token,
      });
      setSubmitted(true);
    } catch (err) {
      setFormError(
        err instanceof LeadError ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-border bg-card p-8 text-center shadow-card"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold">
          You're in. We'll reach out within 24h.
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Meanwhile, a personalised career roadmap is heading to your inbox.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`relative ${compact ? "grid gap-3" : "grid gap-4"}`}>
      {/* Honeypot: invisible to people, irresistible to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Field name="name" label="Full name" placeholder="Aisha Verma" error={errors.name} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          name="email"
          label="Email"
          placeholder="aisha@email.com"
          type="email"
          error={errors.email}
        />
        <Field
          name="phone"
          label="Phone"
          placeholder="+91 7304833625"
          type="tel"
          error={errors.phone}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Course interest
        </label>
        <select
          name="interest"
          defaultValue={defaultInterest ?? ""}
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Pick a program (optional)</option>
          {courses.map((c) => (
            <option key={c.slug} value={c.title}>
              {c.title}
            </option>
          ))}
          <option value="Not sure yet">Not sure yet — guide me</option>
        </select>
      </div>
      <Turnstile onToken={onToken} />
      {formError && (
        <p role="alert" className="text-center text-xs font-medium text-destructive">
          {formError}
        </p>
      )}
      <button
        type="submit"
        disabled={sending}
        className="btn-sheen group mt-2 disabled:opacity-60 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_35px_-5px_hsl(var(--accent)/0.6)]"
      >
        <span>{sending ? "Sending…" : "Book Free Career Guidance Call"}</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </button>
      <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
        <span>No spam. 100% confidential counseling with expert mentors.</span>
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  placeholder,
  type = "text",
  error,
}: {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
