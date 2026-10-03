import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { courses } from "@/data/site";

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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

    const searchParams =
      typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const utmSource = searchParams?.get("utm_source") || "website_direct";
    const utmMedium = searchParams?.get("utm_medium") || undefined;
    const utmCampaign = searchParams?.get("utm_campaign") || undefined;
    const utmTerm = searchParams?.get("utm_term") || undefined;
    const utmContent = searchParams?.get("utm_content") || undefined;

    // Save directly into Fin-Envision CRM Store
    import("@/lib/admin-store").then(({ addLead }) => {
      addLead({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        courseInterest: parsed.data.interest || "Chartered Financial Analyst (CFA®) Level 1",
        leadStage: "Inquiry",
        city: "Mumbai",
        sourcePage: typeof window !== "undefined" ? window.location.pathname : "/contact",
        utmSource,
        utmMedium,
        utmCampaign,
        utmTerm,
        utmContent,
      });
    });

    const data = {
      Name: parsed.data.name,
      Email: parsed.data.email,
      Phone: parsed.data.phone,
      "Course Interest": parsed.data.interest || "Not specified",
      _subject: "New Career Guidance Booking - Fin-Envision",
    };

    fetch("https://formsubmit.co/ajax/contactfinenvision@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => console.log("Form submitted successfully:", data))
      .catch((err) => console.error("Error submitting form:", err));

    setSubmitted(true);
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
    <form onSubmit={onSubmit} className={compact ? "grid gap-3" : "grid gap-4"}>
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
      <button
        type="submit"
        className="btn-sheen group mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-5 py-3.5 text-sm font-bold text-primary-foreground shadow-glow transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_35px_-5px_hsl(var(--accent)/0.6)]"
      >
        <span>Book Free Career Guidance Call</span>
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
