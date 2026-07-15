import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ArrowRight, Briefcase, Users, Target, Award, Building2, Brain,
  FileText, MessageSquare, Network, ShieldCheck, Zap, GraduationCap, Scale, Cpu, Quote,
  Rocket, ClipboardList, UserCheck, Handshake,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { FadeIn, Stagger, StaggerItem, staggerItemVariants, Counter } from "@/components/site/primitives";
import { PremiumOrbs, AmbientDark, AmbientLight, EyebrowBadge, GradientAccent } from "@/components/site/premium";
import { CompaniesMarquee } from "@/components/site/Marquee";
import { FAQ } from "@/components/site/FAQ";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/career-guidance")({
  head: () => ({
    meta: [
      { title: "Career Services — Launch Your Finance Career | Fin-Envision Learning" },
      { name: "description", content: "Lifetime placement support. 130+ company network. ~5-day average placement cycle. Hire from a pre-vetted, job-ready talent pool." },
      { property: "og:title", content: "Career Services — Launch Your Finance Career" },
      { property: "og:url", content: "/career-guidance" },
    ],
    links: [{ rel: "canonical", href: "/career-guidance" }],
  }),
  component: CareerPage,
});

// ─────────────────────────────── data ───────────────────────────────
const heroStats = [
  { value: 130, suffix: "+", label: "Company network" },
  { value: 5, suffix: " days", label: "Avg placement cycle", prefix: "~" },
  { value: 26, suffix: "L", label: "Top CTC per annum", prefix: "₹" },
  { value: 20, suffix: " jobs", label: "Shared per month", prefix: "~" },
];

const candidateServices = [
  {
    icon: Network,
    title: "Lifetime Job Board Access",
    body: "Early access to openings, alumni referrals, and mentor network jobs — shared directly via our active WhatsApp broadcast.",
    accent: "from-amber-400 to-orange-600",
    stats: [{ k: "Live roles weekly", v: "40+" }, { k: "Alumni referrals", v: "26%" }],
  },
  {
    icon: MessageSquare,
    title: "Interview Prep & Mock Interviews",
    body: "1:1 mocks with practitioners, recorded feedback loops, and frameworks for behavioural + technical rounds.",
    accent: "from-rose-500 to-pink-700",
    stats: [{ k: "Equity research roles", v: "30%" }, { k: "Wealth management roles", v: "16%" }],
  },
  {
    icon: FileText,
    title: "Resume Building Support",
    body: "Templates used by 27k+ candidates, line-by-line edits and ATS-optimised bullets reviewed by hiring managers.",
    accent: "from-indigo-600 to-violet-800",
    stats: [{ k: "Freshers placed", v: "65%" }, { k: "Non-freshers placed", v: "35%" }],
  },
];

const hiringPillars = [
  { icon: Award, t: "Trained & Job-Ready Talent", b: "Coached to apply what they learn — CFA®, FRM®, NISM foundations plus practical exposure. Impact from Day 1." },
  { icon: Brain, t: "Industry-Aligned Pedagogy", b: "Beyond textbooks: case studies, live problem-solving, application-driven training. Critical thinkers who adapt fast." },
  { icon: Zap, t: "Flexible Hiring Solutions", b: "Full-time, interns or project-based — remote, hybrid, on-site. We adapt to your model, exact talent when needed." },
  { icon: ShieldCheck, t: "Pre-Screened & Vetted Pool", b: "Every candidate assessed and shortlisted before reaching recruiters — saving you hours and ensuring quality." },
  { icon: Building2, t: "Proven Employer Trust", b: "130+ company network with ~25% repeat hires — long-term relationships, not one-off placements." },
  { icon: Target, t: "Dedicated Talent Partner", b: "A single point of contact who understands your role brief, culture and turnaround expectations." },
];

const academicMix = [
  { icon: GraduationCap, label: "Commerce Graduates", body: "Ready for accounting, audit, and core finance functions.", tone: "from-amber-500 to-orange-700" },
  { icon: Cpu, label: "Engineers", body: "Equipped for analytical, fintech, and quantitative finance roles.", tone: "from-cyan-600 to-blue-800" },
  { icon: Scale, label: "Law Graduates", body: "Skilled for compliance, corporate governance, and regulatory finance.", tone: "from-emerald-600 to-teal-800" },
];

const ageMix = [
  { label: "20–25 yrs", pct: 46 },
  { label: "26–30 yrs", pct: 32 },
  { label: "30+ yrs", pct: 22 },
];

const expMix = [
  { label: "Freshers", pct: 35 },
  { label: "0–3 yrs", pct: 36 },
  { label: "Working professionals", pct: 29 },
];

const tabs = ["For Candidates", "For Companies"] as const;

const clientQuotes = [
  {
    quote: "I have been a student of Fin-Envision and the founders ensured that all fundamentals of finance are embedded in me through a very simple way of teaching. Fin-Envision has been very responsive in providing candidates whenever there is a requirement.",
    name: "Rohan Kuppa",
    role: "Founder & CEO, Gravitas Investments",
    tone: "from-[#1a3a5c] to-[#2d5a8c]",
  },
  {
    quote: "Fin-Envision has been our preferred partner for hiring risk professionals since 2018. Their coaching produces candidates who are conceptually sound and immediately effective in real-world BFSI roles.",
    name: "Sushant Majhi",
    role: "Chief Risk Officer, ICCL (BSE Ltd)",
    tone: "from-rose-600 to-red-800",
  },
  {
    quote: "What we love about Fin-Envision candidates is the depth of preparation. We've consistently seen clarity of thought, practical knowledge, and a short ramp-up — across both entry-level and senior hires.",
    name: "Anika Verma",
    role: "Head of Talent, Maple Capital",
    tone: "from-emerald-700 to-teal-900",
  },
];

/* Premium section heading */
function PremiumHeader({
  eyebrow, title, description, tone = "light", align = "left",
}: {
  eyebrow: string; title: React.ReactNode; description?: string;
  tone?: "light" | "dark"; align?: "left" | "center";
}) {
  return (
    <div className={cn("flex flex-col gap-5", align === "center" && "items-center text-center")}>
      <EyebrowBadge tone={tone}>{eyebrow}</EyebrowBadge>
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className={cn(
          "font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl",
          tone === "dark" ? "text-white" : "text-foreground",
          align === "center" && "max-w-3xl"
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            "max-w-2xl text-pretty text-base md:text-lg",
            tone === "dark" ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

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

// ─────────────────────────────── component ───────────────────────────────
function CareerPage() {
  const [view, setView] = useState<(typeof tabs)[number]>("For Candidates");

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[hsl(220_55%_12%)] text-primary-foreground">
        <PremiumOrbs />

        <div className="container-px relative mx-auto max-w-7xl pb-24 pt-20 md:pt-28">
          <EyebrowBadge tone="dark">Lifetime placement support</EyebrowBadge>

          <div className="mt-6 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[5.5rem]"
              >
                Launch your <GradientAccent>finance career.</GradientAccent>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="mt-6 max-w-2xl text-pretty text-lg text-white/75 md:text-xl"
              >
                Our commitment doesn't end with your course. With lifetime placement support, students gain continuous access to opportunities, while companies benefit from a steady pool of trained, job-ready talent.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.35 }} className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-transform hover:scale-[1.02]"
                >
                  <motion.span
                    aria-hidden
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                  <span className="relative">Contact career services</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
                <a href="#hire" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur transition-all hover:scale-[1.02] hover:border-accent/40 hover:bg-white/20">
                  Hire from us
                </a>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75 backdrop-blur">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-80" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Avg reply ≤ 1 hour
                </span>
              </motion.div>
            </div>

            {/* floating hero stat card with rotating halo */}
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
                <div className="text-[10px] uppercase tracking-[0.24em] text-accent">By the numbers</div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  {heroStats.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + i * 0.07 }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-accent/40 hover:bg-white/10"
                    >
                      <div className="font-display text-3xl font-semibold text-white">
                        <Counter to={s.value} suffix={s.suffix} prefix={s.prefix} />
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/65">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-5 -right-5 hidden rounded-2xl border border-border bg-card px-4 py-3 text-foreground shadow-elevated md:block"
              >
                <div className="text-[10px] uppercase tracking-[0.2em] text-accent">Salary range</div>
                <div className="font-display text-sm font-semibold">₹1.2L — ₹26L p.a.</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PLACED-AT MARQUEE — dark stage */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[hsl(220_60%_9%)] py-20 text-primary-foreground">
        <AmbientDark />
        {/* top hairline accent */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

        <FadeIn className="container-px relative mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
            <div className="flex max-w-2xl flex-col gap-5">
              <EyebrowBadge tone="dark">Where our learners work</EyebrowBadge>
              <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-5xl lg:text-6xl">
                Our students are placed at <GradientAccent>these companies.</GradientAccent>
              </h2>
              <p className="text-pretty text-white/65 md:text-lg">
                From boutique advisory desks to global investment banks — a hiring network that opens doors across the world's top finance floors.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-3 gap-3 md:min-w-[420px]"
            >
              {[
                { v: 130, s: "+", l: "Active partners" },
                { v: 27, s: "k+", l: "Talent pool" },
                { v: 50, s: "+", l: "Countries" },
              ].map((x) => (
                <div
                  key={x.l}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 backdrop-blur"
                >
                  <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-accent/15 blur-2xl" />
                  <div className="relative font-display text-2xl font-bold text-white">
                    <Counter to={x.v} suffix={x.s} />
                  </div>
                  <div className="relative mt-1 text-[10px] uppercase tracking-[0.18em] text-white/55">{x.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* live signal row */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-white/55">
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="uppercase tracking-[0.2em]">Hiring this week</span>
            </span>
            <span className="hidden h-3 w-px bg-white/15 md:inline-block" />
            <span className="uppercase tracking-[0.2em]">Investment Banking · Equity Research · Risk · PE/VC · Treasury</span>
          </div>
        </FadeIn>

        {/* dual-row marquee with edge fades */}
        <div className="relative mt-12 space-y-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[hsl(220_60%_9%)] to-transparent md:w-40" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[hsl(220_60%_9%)] to-transparent md:w-40" />
          <CompaniesMarquee speed="55s" />
          <CompaniesMarquee reverse speed="45s" />
        </div>
      </section>

      {/* TAB SWITCHER */}
      <section className="container-px mx-auto max-w-7xl pt-24">
        <FadeIn>
          <div className="mx-auto inline-flex rounded-full border border-border bg-card p-1.5 shadow-card">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setView(t)}
                className={cn(
                  "relative rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors",
                  view === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {view === t && (
                  <motion.span layoutId="career-pill" className="absolute inset-0 rounded-full bg-gradient-brand shadow-glow" transition={{ type: "spring", duration: 0.5 }} />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>
        </FadeIn>
      </section>

      <AnimatePresence mode="wait">
        {view === "For Candidates" && (
          <motion.section
            key="cand"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden py-24 md:py-32"
          >
            <AmbientLight />
            <div className="container-px relative mx-auto max-w-7xl">
              <PremiumHeader
                eyebrow="For Candidates"
                title={<>Guiding you to the <GradientAccent>right role.</GradientAccent></>}
                description="We're not a recruitment agency. We prepare you with skills, projects, and interview training, so your placement is earned, not handed."
              />

              <div className="mt-14 space-y-7">
                {candidateServices.map((s, i) => {
                  const total = candidateServices.length;
                  const reverse = i % 2 === 1;
                  return (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative overflow-hidden rounded-[2rem] p-[1.5px]"
                    >
                      {/* rotating conic frame */}
                      <motion.span
                        aria-hidden
                        className="absolute inset-[-50%] opacity-0 transition-opacity duration-500 group-hover:opacity-90"
                        style={{
                          background:
                            "conic-gradient(from 0deg, hsl(var(--accent)/0.55), transparent 25%, hsl(var(--primary)/0.7) 55%, transparent 80%, hsl(var(--accent)/0.55))",
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                      />
                      <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-border" />

                      <div
                        className={cn(
                          "relative grid gap-8 overflow-hidden rounded-[calc(2rem-1.5px)] bg-card p-8 transition-all md:grid-cols-[1.4fr_1fr] md:p-10",
                          reverse && "md:[&>*:first-child]:order-2",
                        )}
                      >
                        {/* ambient mesh */}
                        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        <div className="relative">
                          {/* step ribbon */}
                          <div className="flex items-center gap-3">
                            <div className="relative grid h-14 w-14 shrink-0 place-items-center">
                              <ConicRing size="h-14 w-14" />
                              <div className={cn("relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br text-white shadow-glow", s.accent)}>
                                <s.icon className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="flex min-w-0 flex-col gap-1">
                              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
                                Service · {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                              </span>
                              <div className="flex items-center gap-2">
                                <div className="h-1 w-32 overflow-hidden rounded-full bg-muted">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${((i + 1) / total) * 100}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                    className={cn("h-full rounded-full bg-gradient-to-r", s.accent)}
                                  />
                                </div>
                                <span className="font-display text-xs font-bold text-muted-foreground/50">
                                  0{i + 1}
                                </span>
                              </div>
                            </div>
                          </div>

                          <h3 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                            {s.title}
                          </h3>
                          <p className="mt-4 text-muted-foreground md:text-lg">{s.body}</p>

                          <div className="mt-6 flex flex-wrap gap-3">
                            {s.stats.map((st, k) => (
                              <motion.div
                                key={st.k}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: 0.2 + k * 0.08 }}
                                className="group/stat relative overflow-hidden rounded-2xl border border-border bg-background px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-card"
                              >
                                <span className={cn("absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r origin-left scale-x-0 transition-transform duration-500 group-hover/stat:scale-x-100", s.accent)} />
                                <div className="font-display text-2xl font-semibold text-primary">{st.v}</div>
                                <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{st.k}</div>
                              </motion.div>
                            ))}
                          </div>

                          <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                            <span className="story-link">Explore this service</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>

                        <div className={cn("relative aspect-[5/4] overflow-hidden rounded-2xl bg-gradient-to-br md:aspect-auto", s.accent)}>
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.35),transparent_60%)]" />
                          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.55))]" />
                          {/* dot grid */}
                          <div
                            className="absolute inset-0 opacity-[0.18]"
                            style={{
                              backgroundImage: "radial-gradient(white 1px, transparent 1px)",
                              backgroundSize: "22px 22px",
                              maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
                            }}
                          />
                          {/* shimmer sweep */}
                          <motion.div
                            aria-hidden
                            animate={{ x: ["-120%", "120%"] }}
                            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                          />
                          {/* counter-rotating dashed ring */}
                          <motion.div
                            aria-hidden
                            animate={{ rotate: -360 }}
                            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-6 rounded-full border border-dashed border-white/25"
                          />
                          {/* center icon orb */}
                          <div className="absolute inset-0 grid place-items-center">
                            <motion.div
                              whileHover={{ scale: 1.08, rotate: 4 }}
                              transition={{ type: "spring", stiffness: 220, damping: 14 }}
                              className="relative grid h-28 w-28 place-items-center rounded-3xl bg-white/15 backdrop-blur-md ring-1 ring-white/30"
                            >
                              <s.icon className="h-12 w-12 text-white drop-shadow" />
                            </motion.div>
                          </div>
                          {/* floating chip top-right */}
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur"
                          >
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70" />
                              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                            </span>
                            Active
                          </motion.div>
                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                            <span className="font-display text-sm font-semibold drop-shadow">
                              {s.title.split(" ").slice(0, 2).join(" ")}
                            </span>
                            <span className="text-[10px] uppercase tracking-[0.2em] opacity-85">
                              Service · 0{i + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.section>
        )}

        {view === "For Companies" && (
          <motion.section
            key="comp"
            id="hire"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="relative overflow-hidden py-24 md:py-32"
          >
            <AmbientLight />
            <div className="container-px relative mx-auto max-w-7xl">
              <PremiumHeader
                eyebrow="For Hiring Companies"
                title={<>Your competitive edge in <GradientAccent>finance talent.</GradientAccent></>}
                description="Why sift endlessly when you can hire ready-to-contribute professionals? We deliver a pre-vetted pool trained in CFA®, FRM®, NISM — sharpened with industry-aligned skills."
              />

              <Stagger className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {hiringPillars.map((p, i) => (
                  <StaggerItem key={p.t} variants={staggerItemVariants}>
                    <div className="group relative h-full overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card transition-all hover-lift">
                      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30" />
                      <div className="flex items-center justify-between">
                        <div className="relative grid h-14 w-14 place-items-center">
                          <ConicRing size="h-14 w-14" />
                          <div className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow">
                            <p.icon className="h-5 w-5" />
                          </div>
                        </div>
                        <span className="font-display text-2xl font-bold text-muted-foreground/25">0{i + 1}</span>
                      </div>
                      <h3 className="mt-5 font-display text-xl font-semibold">{p.t}</h3>
                      <p className="mt-3 text-sm text-muted-foreground">{p.b}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>

              {/* Talent demographics */}
              <FadeIn>
                <div className="mt-16 grid gap-6 lg:grid-cols-2">
                  <div className="rounded-[2rem] border border-border bg-card p-8 shadow-elevated md:p-10">
                    <EyebrowBadge>Talent dynamics</EyebrowBadge>
                    <h3 className="mt-5 font-display text-2xl font-semibold md:text-3xl">
                      Young, driven, <GradientAccent>job-ready.</GradientAccent>
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground">Nearly half of our learners are 20–25, including 35% freshers and 29% working professionals.</p>

                    <div className="mt-8 space-y-5">
                      {ageMix.map((a, i) => (
                        <div key={a.label}>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{a.label}</span>
                            <span className="font-display font-semibold text-primary">{a.pct}%</span>
                          </div>
                          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${a.pct}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                              className="h-full rounded-full bg-gradient-brand"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 border-t border-border pt-8">
                      <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">Work experience</div>
                      <div className="mt-5 grid grid-cols-3 gap-3">
                        {expMix.map((e) => (
                          <div key={e.label} className="rounded-2xl border border-border bg-background p-4 text-center transition-colors hover:border-accent/50">
                            <div className="font-display text-3xl font-semibold text-primary">{e.pct}%</div>
                            <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{e.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden rounded-[2rem] border border-border bg-navy-gradient p-8 text-primary-foreground shadow-elevated md:p-10">
                    <AmbientDark />
                    <div className="relative">
                      <EyebrowBadge tone="dark">Power of two</EyebrowBadge>
                      <h3 className="mt-5 font-display text-2xl font-semibold text-white md:text-3xl">
                        Technical know-how + <GradientAccent>financial insight.</GradientAccent>
                      </h3>
                      <p className="mt-3 text-sm text-white/70">Diverse academic streams, trained with finance certifications — dual expertise that fits real-world hiring needs.</p>

                      <div className="mt-8 space-y-3">
                        {academicMix.map((a) => (
                          <div key={a.label} className="group flex items-start gap-4 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/10">
                            <div className="relative grid h-14 w-14 shrink-0 place-items-center">
                              <ConicRing size="h-14 w-14" />
                              <div className={cn("relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br text-white shadow", a.tone)}>
                                <a.icon className="h-5 w-5" />
                              </div>
                            </div>
                            <div>
                              <div className="font-display text-base font-semibold text-white">{a.label}</div>
                              <div className="mt-1 text-sm text-white/70">{a.body}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Client testimonials — homepage-style auto-scroll marquee */}
              <div className="mt-20">
                <PremiumHeader
                  eyebrow="Recruiter voices"
                  title={<>Hear what our <GradientAccent>clients are raving about.</GradientAccent></>}
                />

                <div className="relative mt-12 overflow-hidden">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
                  <div className="flex w-max gap-6 animate-marquee">
                    {[...clientQuotes, ...clientQuotes, ...clientQuotes].map((q, i) => (
                      <article
                        key={i}
                        className="group relative flex w-[360px] flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-soft transition-all hover-lift md:w-[440px]"
                      >
                        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                        <Quote className="h-9 w-9 text-accent" />
                        <p className="mt-5 text-[15px] leading-relaxed text-foreground/85">"{q.quote}"</p>
                        <div className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                          <div className="relative grid h-12 w-12 place-items-center">
                            <ConicRing size="h-12 w-12" />
                            <div className={cn("relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br font-display text-sm font-bold text-white shadow", q.tone)}>
                              {q.name.split(" ").map((p) => p[0]).join("")}
                            </div>
                          </div>
                          <div>
                            <div className="font-display text-sm font-semibold">{q.name}</div>
                            <div className="text-xs text-muted-foreground">{q.role}</div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* DUAL CTA BANNER */}
      {/* HIRING JOURNEY TIMELINE — homepage YourJourney parallel */}
      <section className="relative overflow-hidden bg-[hsl(220_50%_9%)] py-24 text-primary-foreground md:py-32">
        <AmbientDark />
        <div className="container-px relative mx-auto max-w-7xl">
          <PremiumHeader
            tone="dark"
            align="center"
            eyebrow="The journey"
            title={<>From brief to <GradientAccent>first day on the job.</GradientAccent></>}
            description="A streamlined four-step cycle — most roles close in under a week."
          />

          <div className="relative mt-16">
            <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent md:block" />
            <Stagger className="grid gap-6 md:grid-cols-4">
              {[
                { icon: Rocket, badge: "Day 0", title: "Share the brief", body: "Drop the role, must-haves and timeline — a talent partner picks it up the same day." },
                { icon: ClipboardList, badge: "Day 1", title: "Shortlist curated", body: "Pre-vetted profiles matched to your stack, certifications and culture fit." },
                { icon: UserCheck, badge: "Day 2–4", title: "Interview & assess", body: "Mock-tested candidates arrive interview-ready with portfolios and recorded mocks." },
                { icon: Handshake, badge: "Day 5", title: "Offer & onboard", body: "Close fast with full salary benchmarks, references and onboarding handover." },
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

      {/* DUAL CTA BANNER */}
      <section className="container-px mx-auto max-w-7xl py-24">
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { t: "I'm a learner", b: "Get placement support, mock interviews and a lifetime job board.", cta: "Talk to career services", href: "/contact", icon: Briefcase, tone: "from-amber-500 to-orange-600" },
            { t: "I'm hiring", b: "Hire pre-vetted CFA® / FRM® / NISM-trained talent in ~5 days.", cta: "Request talent", href: "/contact", icon: Users, tone: "from-[#1a3a5c] to-[#2d5a8c]" },
          ].map((c, i) => (
            <motion.div
              key={c.t}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={c.href} className="group relative block overflow-hidden rounded-[2rem] border border-border bg-card p-10 transition-all hover-lift">
                <div className={cn("pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-60", c.tone)} />
                <div className="relative grid h-16 w-16 place-items-center">
                  <ConicRing size="h-16 w-16" />
                  <div className={cn("relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br text-white shadow-glow", c.tone)}>
                    <c.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-6 font-display text-3xl font-semibold">{c.t}</div>
                <div className="mt-2 text-muted-foreground">{c.b}</div>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  {c.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        eyebrow="FAQ"
        title={<>Career services <span className="italic bg-gradient-to-r from-accent via-accent to-accent/60 bg-clip-text text-transparent">questions.</span></>}
        description="Common questions about placement, hiring partnerships and our talent pool."
      />

    </SiteLayout>
  );
}
