import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Mail, Phone, MapPin, MessageCircle, ArrowRight, Sparkles,
  Send, UserCheck, CalendarCheck, Rocket, Quote,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { FadeIn, Stagger, StaggerItem, staggerItemVariants, Counter } from "@/components/site/primitives";
import { PremiumOrbs, AmbientDark, AmbientLight, EyebrowBadge, GradientAccent } from "@/components/site/premium";
import { LeadForm } from "@/components/site/LeadForm";
import { FAQ } from "@/components/site/FAQ";
import { brand } from "@/data/site";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Fin-Envision Learning" },
      { name: "description", content: "Talk to our team. WhatsApp, email, phone or visit us in Mumbai." },
      { property: "og:title", content: "Contact — Fin-Envision Learning" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ConicRing({ size = "h-14 w-14" }: { size?: string }) {
  return (
    <motion.span
      aria-hidden
      animate={{ rotate: 360 }}
      transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      className={cn("absolute -inset-1 rounded-full opacity-70", size)}
      style={{
        background:
          "conic-gradient(from 0deg, hsl(var(--accent)), hsl(var(--primary)), transparent 60%, hsl(var(--accent)))",
        mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
        WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
      }}
    />
  );
}

function ContactPage() {
  const quick = [
    { icon: MessageCircle, label: "WhatsApp", value: brand.whatsapp, href: `https://wa.me/${brand.whatsapp.replace(/\D/g, "")}`, tone: "from-emerald-500 to-teal-700" },
    { icon: Phone, label: "Call us", value: brand.phone, href: `tel:${brand.phone.replace(/\s/g, "")}`, tone: "from-amber-500 to-orange-600" },
    { icon: Mail, label: "Email", value: brand.email, href: `mailto:${brand.email}`, tone: "from-rose-500 to-pink-700" },
    { icon: MapPin, label: "Visit", value: "Thane, Mumbai", href: "https://maps.app.goo.gl/3ira5ZEkf5i5YPGA9", tone: "from-indigo-600 to-violet-800" },
  ];

  return (
    <SiteLayout>
      {/* HERO — premium dark */}
      <section className="relative overflow-hidden bg-[hsl(220_55%_12%)] text-primary-foreground">
        <PremiumOrbs />

        <div className="container-px relative mx-auto max-w-7xl pb-20 pt-20 md:pt-28">
          <EyebrowBadge tone="dark">Contact us</EyebrowBadge>

          <div className="mt-6 grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[5.5rem]"
              >
                We reply to <GradientAccent>every message.</GradientAccent>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="mt-6 max-w-2xl text-pretty text-lg text-white/75 md:text-xl"
              >
                Usually within an hour during working hours. Pick your channel — WhatsApp is fastest, email is best for detailed questions.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <a
                  href={`https://wa.me/${brand.whatsapp.replace(/\D/g, "")}`}
                  target="_blank" rel="noreferrer"
                  className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-transform hover:scale-[1.02]"
                >
                  <motion.span
                    aria-hidden
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                  <span className="relative">WhatsApp us</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </a>
                <a href="#form" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur transition-all hover:scale-[1.02] hover:border-accent/40 hover:bg-white/20">
                  Send a message
                </a>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur">
                  <Sparkles className="h-3 w-3 text-accent" />
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Avg reply ≤ 1 day
                </span>
              </motion.div>
            </div>

            {/* Hero stat card with rotating halo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              className="relative"
            >
              <motion.span
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-[1px] rounded-[2rem] opacity-60"
                style={{
                  background:
                    "conic-gradient(from 0deg, hsl(var(--accent)/0.6), transparent 30%, hsl(var(--primary)/0.6) 60%, transparent 90%, hsl(var(--accent)/0.6))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
                }}
              />
              <div className="relative rounded-[2rem] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                <div className="text-[10px] uppercase tracking-[0.24em] text-accent">Support pulse</div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { v: 1, sfx: " day", lbl: "Avg reply", pfx: "≤ " },
                    
                    { v: 7, sfx: " days", lbl: "Open weekly" },
                  ].map((s, i) => (
                    <motion.div
                      key={s.lbl}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.07 }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-accent/40 hover:bg-white/10"
                    >
                      <div className="font-display text-3xl font-semibold text-white">
                        <Counter to={s.v} suffix={s.sfx} prefix={s.pfx} />
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/65">{s.lbl}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -right-5 hidden rounded-2xl border border-border bg-card px-4 py-3 text-foreground shadow-elevated md:block"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-accent">Online now</div>
                <div className="font-display text-sm font-semibold">Career & admissions desks</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FORM + QUICK CONTACT */}
      <section id="form" className="relative overflow-hidden py-24 md:py-32">
        <AmbientLight />
        <div className="container-px relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <FadeIn>
              <div className="relative">
                {/* Rotating gradient border around lead form */}
                <motion.span
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-[1px] rounded-[2rem] opacity-50"
                  style={{
                    background:
                      "conic-gradient(from 0deg, hsl(var(--accent)/0.6), transparent 30%, hsl(var(--primary)/0.6) 60%, transparent 90%, hsl(var(--accent)/0.6))",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
                    WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
                  }}
                />
                <div className="relative rounded-[2rem] border border-border bg-card p-7 shadow-elevated md:p-10">
                  <EyebrowBadge>Lead form</EyebrowBadge>
                  <h2 className="mt-5 font-display text-3xl font-semibold leading-tight md:text-4xl">
                    Tell us a bit <GradientAccent>about you.</GradientAccent>
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">We'll come back with a personalised next step.</p>
                  <div className="mt-8"><LeadForm /></div>
                </div>
              </div>
            </FadeIn>

            <div className="space-y-4">
              {quick.map((q, i) => {
                const Tag = q.href ? "a" : "div";
                return (
                  <motion.div
                    key={q.label}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Tag
                      href={q.href}
                      {...(q.href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group relative flex items-center gap-4 overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-card transition-all hover-lift"
                    >
                      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="relative grid h-14 w-14 shrink-0 place-items-center">
                        <ConicRing size="h-14 w-14" />
                        <div className={cn("relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br text-white shadow-glow", q.tone)}>
                          <q.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">{q.label}</div>
                        <div className="mt-1 truncate font-display text-base font-semibold">{q.value}</div>
                      </div>
                      {q.href && <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />}
                    </Tag>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Map block */}
          <FadeIn>
            <div className="mt-12 overflow-hidden rounded-[2rem] border border-border shadow-elevated">
              <div className="relative aspect-[21/9] bg-gradient-brand">
                <div className="absolute inset-0 bg-mesh opacity-40 mix-blend-overlay" />
                <motion.div
                  aria-hidden
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />
                <div className="absolute inset-0 grid place-items-center text-center text-primary-foreground">
                  <div>
                    <div className="relative mx-auto grid h-16 w-16 place-items-center">
                      <ConicRing size="h-16 w-16" />
                      <div className="relative grid h-14 w-14 place-items-center rounded-full bg-white/15 backdrop-blur">
                        <MapPin className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="mt-5 font-display text-2xl font-semibold">{brand.address}</div>
                    <div className="mt-1 text-sm opacity-80">Thane · easy access from station</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT — dark journey timeline */}
      <section className="relative overflow-hidden bg-[hsl(220_50%_9%)] py-24 text-primary-foreground md:py-32">
        <AmbientDark />
        <div className="container-px relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-5 text-center">
            <EyebrowBadge tone="dark">What happens next</EyebrowBadge>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              From message to <GradientAccent>first session.</GradientAccent>
            </motion.h2>
            <p className="max-w-2xl text-pretty text-base text-white/70 md:text-lg">
              A simple, transparent path — no spam, no pressure.
            </p>
          </div>

          <div className="relative mt-16">
            <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:block" />
            <Stagger className="grid gap-6 md:grid-cols-4">
              {[
                { icon: Send, badge: "Step 1", title: "You reach out", body: "Drop a message via WhatsApp, email, the lead form or a quick call." },
                { icon: UserCheck, badge: "Step 2", title: "We listen", body: "A counsellor maps your goals, background and timeline in a 20-min chat." },
                { icon: CalendarCheck, badge: "Step 3", title: "Tailored plan", body: "Course recommendation, fee plan, batch options and demo lecture access." },
                { icon: Rocket, badge: "Step 4", title: "You start", body: "Onboarded into a live batch with mentor, study group and resources." },
              ].map((step, i) => (
                <StaggerItem key={step.title} variants={staggerItemVariants}>
                  <div className="group relative h-full overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-white/10">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/25 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                    <div className="flex items-center justify-between">
                      <div className="relative grid h-14 w-14 place-items-center">
                        <ConicRing size="h-14 w-14" />
                        <div className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow">
                          <step.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/80">{step.badge}</span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-semibold text-white">{step.title}</h3>
                    <p className="mt-2 text-sm text-white/70">{step.body}</p>
                    <div className="mt-5 font-display text-3xl font-bold text-white/15">0{i + 1}</div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>


      {/* FAQ */}
      <FAQ
        eyebrow="FAQ"
        title={<>Quick <span className="italic bg-gradient-to-r from-accent via-accent to-accent/60 bg-clip-text text-transparent pr-[0.15em] -mr-[0.15em]">answers.</span></>}
        description="The most common things people ask before reaching out."
      />

    </SiteLayout>
  );
}
