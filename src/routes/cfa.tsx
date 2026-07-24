import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowRight, Sparkles, Clock, Eye, Languages, ShieldCheck, Truck, Download,
  BookOpen, Briefcase, LineChart, Search, Building2, Wallet, PieChart, Landmark, Banknote,
  FileText, ListChecks, Award, Calendar, Tag, Info, GraduationCap, MapPin, CheckCircle2,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { FadeIn, Stagger, StaggerItem, staggerItemVariants } from "@/components/site/primitives";
import { PremiumOrbs, AmbientDark, EyebrowBadge, GradientAccent } from "@/components/site/premium";
import { CompaniesMarquee } from "@/components/site/Marquee";
import { FAQ } from "@/components/site/FAQ";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cfa")({
  head: () => ({
    meta: [
      { title: "CFA Program — Level I, II & III Prep | Fin-Envision Learning" },
      { name: "description", content: "Self-paced CFA Level I, II & III prep with one mentor, real-life examples, and 100% coverage in English + Hindi. Trusted by candidates worldwide." },
      { property: "og:title", content: "CFA Program — Level I, II & III Prep" },
      { property: "og:url", content: "/cfa" },
    ],
    links: [{ rel: "canonical", href: "/cfa" }],
  }),
  component: CFAPage,
});

// ─────────────────────────────── data ───────────────────────────────
type Level = "L1" | "L2" | "L3";

type LevelData = {
  badge: string;
  tagline: string;
  description: string;
  meta: { duration: string; views: string; language: string; coverage: string; validity: string; courier: string };
  pricing: { offline: string; online: string };
  weights: { subject: string; range: string }[];
  exam: { format: string[]; question: string[]; key: string[] };
  deadlines: { window: string; date: string }[];
  registration: { window: string; earlyBird: string; final: string };
  fees: { early: { inr: string; note: string }; standard: { inr: string; note: string } };
};

const levels: Record<Level, LevelData> = {
  L1: {
    badge: "Level I",
    tagline: "Foundations · Tools · Ethics",
    description:
      "Build a strong foundation in finance. Level I introduces candidates to core concepts, tools, and ethical standards — focused on understanding over application. Ideal for students, non-finance backgrounds, and early-stage professionals starting their CFA preparation.",
    meta: { duration: "140+ hours (live)", views: "Unlimited", language: "English + Hindi", coverage: "100%", validity: "Until exam", courier: "As per location" },
    pricing: { offline: "₹36,000", online: "₹20,000" },
    weights: [
      { subject: "Ethics", range: "15 – 20%" },
      { subject: "Quants", range: "6 – 9%" },
      { subject: "Economics", range: "6 – 9%" },
      { subject: "FSA", range: "11 – 14%" },
      { subject: "Corporate Issuers", range: "6 – 9%" },
      { subject: "Portfolio", range: "8 – 12%" },
      { subject: "Equity", range: "11 – 14%" },
      { subject: "Fixed Income", range: "11 – 14%" },
      { subject: "Derivatives", range: "5 – 8%" },
      { subject: "Alt Investments", range: "7 – 10%" },
    ],
    exam: {
      format: ["180 multiple-choice questions in two sessions of 2h 15m each", "Optional break between sessions", "90 questions per session within the time limit"],
      question: ["3 answer choices (A, B, C)", "Sentence-completion and direct questions", "Tests analytical thinking & application"],
      key: ["Average pass rate: 41% (2016 – 2025)", "No penalty for incorrect answers", "Results within 5 – 7 weeks"],
    },
    deadlines: [
      { window: "May 2026", date: "12 – 18 May 2026" },
      { window: "August 2026", date: "18 – 24 Aug 2026" },
      { window: "November 2026", date: "11 – 17 Nov 2026" },
      { window: "February 2027", date: "22 – 28 Feb 2027" },
    ],
    registration: { window: "12 Aug 2025 – 12 Feb 2026", earlyBird: "12 Aug – 14 Oct 2025", final: "15 Oct 2025 – 12 Feb 2026" },
    fees: {
      early: { inr: "₹1,07,963", note: "Best value for early planners" },
      standard: { inr: "₹1,41,109", note: "Standard pricing applies" },
    },
  },
  L2: {
    badge: "Level II",
    tagline: "Application · Valuation · Analysis",
    description:
      "Shift from understanding to application. Level II asks you to apply Level I concepts to exam-style scenarios — particularly in valuation, financial statement analysis, and asset classes. The most analytical and application-driven stage of the program.",
    meta: { duration: "80+ hours (live)", views: "Unlimited", language: "English + Hindi", coverage: "100%", validity: "Until exam", courier: "As per location" },
    pricing: { offline: "₹40,000", online: "₹25,000" },
    weights: [
      { subject: "Ethics", range: "10 – 15%" },
      { subject: "Quants", range: "5 – 10%" },
      { subject: "Economics", range: "5 – 10%" },
      { subject: "FSA", range: "10 – 15%" },
      { subject: "Corporate Issuers", range: "5 – 10%" },
      { subject: "Portfolio", range: "10 – 15%" },
      { subject: "Equity", range: "10 – 15%" },
      { subject: "Fixed Income", range: "10 – 15%" },
      { subject: "Derivatives", range: "5 – 10%" },
      { subject: "Alt Investments", range: "5 – 10%" },
    ],
    exam: {
      format: ["22 item sets (vignettes with accompanying questions)", "Two sessions of 2h 12m each", "Optional break between sessions"],
      question: ["Vignette-supported multiple-choice questions", "Tests critical thinking & applied knowledge", "Three answer choices: A, B, C"],
      key: ["Average pass rate: 46% (2016 – 2025)", "No negative marking — attempt every question", "Results within 5 – 7 weeks"],
    },
    deadlines: [
      { window: "May 2026", date: "19 – 23 May 2026" },
      { window: "August 2026", date: "25 – 29 Aug 2026" },
      { window: "November 2026", date: "18 – 22 Nov 2026" },
    ],
    registration: { window: "12 Aug 2025 – 12 Feb 2026", earlyBird: "12 Aug – 14 Oct 2025", final: "15 Oct 2025 – 12 Feb 2026" },
    fees: {
      early: { inr: "₹1,07,963", note: "Best value for early planners" },
      standard: { inr: "₹1,41,109", note: "Standard pricing applies" },
    },
  },
  L3: {
    badge: "Level III",
    tagline: "Portfolio · Wealth · Strategy",
    description:
      "The final stage focuses on portfolio management, wealth planning and strategic decision-making. In addition to item sets, Level III includes essay-based questions that ask you to clearly articulate investment decisions and reasoning.",
    meta: { duration: "60+ hours (live)", views: "Unlimited", language: "English + Hindi", coverage: "100%", validity: "Until exam", courier: "As per location" },
    pricing: { offline: "₹25,000", online: "₹25,000" },
    weights: [
      { subject: "Asset Allocation", range: "15 – 20%" },
      { subject: "Portfolio Construction", range: "15 – 20%" },
      { subject: "Performance Measurement", range: "5 – 10%" },
      { subject: "Derivatives & Risk Mgmt", range: "10 – 15%" },
      { subject: "Ethical & Professional Standards", range: "10 – 15%" },
      { subject: "Portfolio Mgmt Pathway", range: "30 – 35%" },
      { subject: "Private Market Pathway", range: "30 – 35%" },
      { subject: "Private Wealth Pathway", range: "30 – 35%" },
    ],
    exam: {
      format: ["Mix of item sets and essay (constructed response) sets", "Two sessions of 2h 12m each", "Distribution: 6 item + 5 essay, or 5 item + 6 essay"],
      question: ["Vignette-supported essay & multiple-choice", "Each set worth 12 points", "Tests advanced portfolio & wealth concepts"],
      key: ["Average pass rate: 51% (2016 – 2025)", "No penalty for incorrect answers", "Results in 6 – 8 weeks (essay grading)"],
    },
    deadlines: [
      { window: "August 2026", date: "13 – 17 Aug 2026" },
      { window: "February 2027", date: "18 – 21 Feb 2027" },
    ],
    registration: { window: "11 Nov 2025 – 6 May 2026", earlyBird: "11 Nov 2025 – 21 Jan 2026", final: "21 Jan – 6 May 2026" },
    fees: {
      early: { inr: "₹1,07,963", note: "Best value for early planners" },
      standard: { inr: "₹1,41,109", note: "Standard pricing applies" },
    },
  },
};

// shared across all levels
const careers = [
  { icon: PieChart, t: "Portfolio Management", b: "Manage diversified portfolios to balance risk and return — CFA equips you with asset allocation and risk expertise." },
  { icon: Search, t: "Research", b: "Analyse markets, industries and companies. Strengthens financial modelling and equity research skills." },
  { icon: Briefcase, t: "Consulting", b: "Strategic advice on planning and valuations — in-depth financial analysis and risk management." },
  { icon: ShieldCheck, t: "Risk Analysis", b: "Assess and mitigate risks for businesses and individuals using rigorous risk frameworks." },
  { icon: LineChart, t: "Asset Management", b: "Oversee institutional or individual investments — sharpened investment strategy & performance evaluation." },
  { icon: Wallet, t: "Private Wealth Mgmt", b: "Customised plans for high-net-worth clients aligned to risk tolerance and life goals." },
  { icon: Building2, t: "Commercial Banking", b: "Credit analysis and financial solutions for businesses — corporate finance expertise." },
  { icon: Landmark, t: "Investment Banking", b: "Mergers, acquisitions and capital raising — modelling, valuation and deal structuring." },
];

const importantDetails = [
  { icon: GraduationCap, t: "Eligibility Criteria", b: "Bachelor's degree (or final year), or 4,000 hours of professional work experience." },
  { icon: FileText, t: "Exam Requirement", b: "Two valid IDs, calculator (BA II Plus or HP 12C), and CFA Institute confirmation." },
  { icon: Banknote, t: "Scholarships", b: "Access Access, Student, Women's, and Need-based scholarships to reduce exam fees." },
  { icon: Calendar, t: "Deferral Policy", b: "One-time deferral per level, subject to fee and window — plan before registration closes." },
  { icon: MapPin, t: "Test Centers", b: "Computer-based testing at Prometric centres across 400+ cities worldwide." },
  { icon: Info, t: "Ethics Code", b: "All candidates must adhere to the CFA Institute Code of Ethics & Standards of Conduct." },
];

const comparisonRows = [
  { subject: "Ethics", l1: "15 – 20%", l2: "10 – 15%", l3: "—" },
  { subject: "Quants", l1: "6 – 9%", l2: "5 – 10%", l3: "—" },
  { subject: "Economics", l1: "6 – 9%", l2: "5 – 10%", l3: "—" },
  { subject: "FSA", l1: "11 – 14%", l2: "10 – 15%", l3: "—" },
  { subject: "Corporate Issuers", l1: "6 – 9%", l2: "5 – 10%", l3: "—" },
  { subject: "Portfolio", l1: "8 – 12%", l2: "10 – 15%", l3: "—" },
  { subject: "Equity", l1: "11 – 14%", l2: "10 – 15%", l3: "—" },
  { subject: "Fixed Income", l1: "11 – 14%", l2: "10 – 15%", l3: "—" },
  { subject: "Derivatives", l1: "5 – 8%", l2: "5 – 10%", l3: "—" },
  { subject: "Alt Investments", l1: "7 – 10%", l2: "5 – 10%", l3: "—" },
  { subject: "Asset Allocation", l1: "—", l2: "—", l3: "15 – 20%" },
  { subject: "Portfolio Construction", l1: "—", l2: "—", l3: "15 – 20%" },
  { subject: "Performance Measurement", l1: "—", l2: "—", l3: "5 – 10%" },
  { subject: "Derivatives & Risk Mgmt", l1: "—", l2: "—", l3: "10 – 15%" },
  { subject: "Portfolio Mgmt Pathway", l1: "—", l2: "—", l3: "30 – 35%" },
];

const levelOrder: Level[] = ["L1", "L2", "L3"];
const levelLabels: Record<Level, string> = { L1: "CFA 1", L2: "CFA 2", L3: "CFA 3" };
const levelAccent: Record<Level, string> = {
  L1: "from-amber-500 to-orange-600",
  L2: "from-rose-500 to-pink-700",
  L3: "from-indigo-600 to-violet-800",
};

/* Premium section heading (homepage-style) — ping-dot eyebrow + bold display heading */
function PremiumHeader({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
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

/* Conic-gradient rotating ring around a node — homepage signature */
function ConicRing({ size = "h-14 w-14", className = "" }: { size?: string; className?: string }) {
  return (
    <motion.span
      aria-hidden
      animate={{ rotate: 360 }}
      transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      className={cn("absolute -inset-1 rounded-full opacity-70", size, className)}
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
function CFAPage() {
  const [level, setLevel] = useState<Level>("L1");
  const data = levels[level];
  const maxWeight = useMemo(
    () => Math.max(...data.weights.map((w) => parseInt(w.range.split("–")[1] || w.range))),
    [data]
  );

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[hsl(220_55%_12%)] text-primary-foreground">
        <PremiumOrbs />

        <div className="container-px relative mx-auto max-w-7xl pb-24 pt-20 md:pt-28">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-white/80">
            {["Self-paced lectures", "One mentor", "Real-life examples"].map((t) => (
              <span key={t} className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 backdrop-blur">
                <Sparkles className="h-3 w-3 text-accent" /> {t}
              </span>
            ))}
          </motion.div>

          {/* Level toggle */}
          <div className="mt-8 inline-flex rounded-full border border-white/15 bg-white/10 p-1.5 backdrop-blur">
            {levelOrder.map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-colors",
                  level === l ? "text-foreground" : "text-white/70 hover:text-white"
                )}
              >
                {level === l && (
                  <motion.span layoutId="cfa-pill" className="absolute inset-0 rounded-full bg-accent shadow-glow" transition={{ type: "spring", duration: 0.5 }} />
                )}
                <span className="relative">{levelLabels[l]}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45 }}
              className="mt-8 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end"
            >
              <div>
                <div className="text-sm uppercase tracking-[0.24em] text-accent">{data.tagline}</div>
                <h1 className="mt-4 max-w-3xl text-balance font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl">
                  CFA <GradientAccent>{data.badge}</GradientAccent>
                </h1>
                <p className="mt-3 text-sm uppercase tracking-[0.24em] text-white/60">Chartered Financial Analyst</p>
                <p className="mt-6 max-w-2xl text-pretty text-lg text-white/80">{data.description}</p>
              </div>

              {/* Pricing card with rotating conic ring */}
              <div className="relative">
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
                  <div className="text-[10px] uppercase tracking-[0.24em] text-accent">Enroll now</div>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="font-display text-5xl font-semibold text-white md:text-6xl">{data.pricing.offline}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-transform hover:scale-[1.02]">
                      Enroll <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>


                  <div className="mt-6 grid grid-cols-2 gap-3 text-[11px]">
                    {[
                      { icon: Clock, k: "Duration", v: data.meta.duration },
                      { icon: Eye, k: "Views", v: data.meta.views },
                      { icon: Languages, k: "Language", v: data.meta.language },
                      { icon: ShieldCheck, k: "Coverage", v: data.meta.coverage },
                      { icon: Calendar, k: "Validity", v: data.meta.validity },
                      { icon: Truck, k: "Courier", v: data.meta.courier },
                    ].map((m) => (
                      <div key={m.k} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="flex items-center gap-1.5 text-white/60">
                          <m.icon className="h-3 w-3" /> <span className="uppercase tracking-[0.16em]">{m.k}</span>
                        </div>
                        <div className="mt-1 text-sm font-semibold text-white">{m.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* SYLLABUS WEIGHTS */}
      <section className="relative container-px mx-auto max-w-7xl py-24 md:py-32">
        <PremiumHeader
          eyebrow="Syllabus & weights"
          title={<>Subject weightage — <GradientAccent>{levelLabels[level]}</GradientAccent></>}
          description="Understand exam weightage across all subjects so you can prioritise your prep correctly."
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={level}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {data.weights.map((w, i) => {
              const top = parseInt(w.range.split("–")[1] || w.range);
              const pct = Math.round((top / maxWeight) * 100);
              return (
                <motion.div
                  key={w.subject}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.55, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover-lift"
                >
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25" />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Numbered conic-ring counter — homepage signature */}
                      <div className="relative grid h-12 w-12 place-items-center">
                        <ConicRing size="h-12 w-12" />
                        <div className="relative grid h-10 w-10 place-items-center rounded-full bg-background font-display text-sm font-bold text-primary">
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Subject</div>
                        <div className="mt-0.5 font-display text-base font-semibold leading-tight">{w.subject}</div>
                      </div>
                    </div>
                    <span className={cn("rounded-full bg-gradient-to-br px-3 py-1 text-xs font-bold text-white shadow", levelAccent[level])}>
                      {w.range}
                    </span>
                  </div>
                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className={cn("h-full rounded-full bg-gradient-to-r", levelAccent[level])}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* LEVEL COMPARISON */}
      <section className="container-px mx-auto max-w-7xl pb-24 md:pb-32">
        <PremiumHeader
          eyebrow="Level comparison"
          title={<>All three levels, <GradientAccent>side by side.</GradientAccent></>}
          description="A complete weight comparison across Levels I, II and III to help you plan your full CFA journey."
        />

        <FadeIn>
          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
            <div className="grid grid-cols-4 bg-navy-gradient px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              <div>Subject</div>
              <div className="text-center">Level I</div>
              <div className="text-center">Level II</div>
              <div className="text-center">Level III</div>
            </div>
            <div className="divide-y divide-border">
              {comparisonRows.map((r, i) => (
                <motion.div
                  key={r.subject}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.02, 0.3) }}
                  className={cn(
                    "grid grid-cols-4 items-center px-6 py-3.5 text-sm transition-colors hover:bg-secondary/40",
                    i % 2 === 1 && "bg-secondary/20"
                  )}
                >
                  <div className="font-medium">{r.subject}</div>
                  <div className={cn("text-center", level === "L1" && "font-semibold text-primary")}>{r.l1}</div>
                  <div className={cn("text-center", level === "L2" && "font-semibold text-primary")}>{r.l2}</div>
                  <div className={cn("text-center", level === "L3" && "font-semibold text-primary")}>{r.l3}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">* Ethics and Derivatives in Level III are included in broader curriculum modules.</p>
        </FadeIn>
      </section>

      {/* CAREER OPPORTUNITIES — dark navy "stage" like homepage CareerStage */}
      <section className="relative overflow-hidden bg-[hsl(220_50%_9%)] py-24 text-primary-foreground md:py-32">
        <AmbientDark />
        <div className="container-px relative mx-auto max-w-7xl">
          <PremiumHeader
            tone="dark"
            eyebrow="Career opportunities"
            title={<>Job roles you can <GradientAccent>pursue</GradientAccent> with CFA.</>}
            description="The CFA charter opens doors across investing, research, banking and risk — globally recognised, deeply respected."
          />

          <Stagger className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {careers.map((c, i) => (
              <StaggerItem key={c.t} variants={staggerItemVariants}>
                <div className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.07]">
                  <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/30 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="flex items-center gap-4">
                    <div className="relative grid h-14 w-14 place-items-center">
                      <ConicRing size="h-14 w-14" />
                      <div className="relative grid h-12 w-12 place-items-center rounded-full bg-[hsl(220_50%_9%)] text-accent">
                        <c.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                      0{i + 1}
                    </div>
                  </div>
                  <h3 className="mt-6 font-display text-lg font-semibold text-white">{c.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{c.b}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* WHERE CHARTERHOLDERS WORK */}
      <section className="relative overflow-hidden border-y border-white/5 bg-[hsl(220_60%_10%)] py-20 text-primary-foreground md:py-24">
        <AmbientDark />
        <FadeIn className="container-px relative mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col items-start gap-5">
            <EyebrowBadge tone="dark">Where CFA charterholders work</EyebrowBadge>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Trusted by leading organisations <GradientAccent>worldwide.</GradientAccent>
            </h2>
          </div>
        </FadeIn>
        <div className="relative">
          <CompaniesMarquee />
        </div>
      </section>

      {/* EXAM STRUCTURE */}
      <section className="container-px mx-auto max-w-7xl py-24 md:py-32">
        <PremiumHeader
          eyebrow="Exam structure"
          title={<>Format & requirements — <GradientAccent>{levelLabels[level]}</GradientAccent></>}
          description="Know the format before you sit. Each level has a distinct rhythm — plan your stamina accordingly."
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={level}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-14 grid gap-5 md:grid-cols-3"
          >
            {[
              { icon: ListChecks, t: "Exam Format", items: data.exam.format, accent: "from-amber-500 to-orange-600", num: "01" },
              { icon: FileText, t: "Question Format", items: data.exam.question, accent: "from-rose-500 to-pink-700", num: "02" },
              { icon: Award, t: "Key Details", items: data.exam.key, accent: "from-indigo-600 to-violet-800", num: "03" },
            ].map((b, i) => (
              <motion.div
                key={b.t}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card transition-all hover-lift"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30" />
                <div className="flex items-center justify-between gap-3">
                  <div className="relative grid h-14 w-14 place-items-center">
                    <ConicRing size="h-14 w-14" />
                    <div className={cn("relative grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br text-white shadow-glow", b.accent)}>
                      <b.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <span className="font-display text-2xl font-bold text-muted-foreground/30">{b.num}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold">{b.t}</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {b.items.map((it) => (
                    <li key={it} className="flex gap-2.5">
                      <CheckCircle2 className={cn("mt-0.5 h-4 w-4 shrink-0 bg-gradient-to-br bg-clip-text text-transparent", b.accent)} style={{ color: "hsl(var(--accent))" }} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* DEADLINES & FEES */}
      <section className="container-px mx-auto max-w-7xl pb-24 md:pb-32">
        <PremiumHeader
          eyebrow="Deadlines & fees"
          title={<>Registration windows for <GradientAccent>2026.</GradientAccent></>}
          description="Plan early — the earlier you register, the more you save."
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={level}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_1fr]"
          >
            {/* Exam windows timeline */}
            <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-8 shadow-elevated md:p-10">
              <div className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />
              <EyebrowBadge>Exam windows</EyebrowBadge>
              <h3 className="mt-4 font-display text-2xl font-semibold md:text-3xl">Pick your sitting.</h3>

              <div className="relative mt-8">
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ transformOrigin: "top" }}
                  className="absolute left-5 top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent via-primary/40 to-transparent"
                />
                <div className="space-y-5">
                  {data.deadlines.map((d, i) => (
                    <motion.div
                      key={d.window}
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                      className="flex items-start gap-5"
                    >
                      <div className="relative grid h-10 w-10 shrink-0 place-items-center">
                        <ConicRing size="h-10 w-10" />
                        <div className={cn("relative grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br text-white shadow-glow", levelAccent[level])}>
                          <Calendar className="h-4 w-4" />
                        </div>
                      </div>
                      <div className="flex-1 rounded-2xl border border-border bg-background p-4 transition-colors hover:border-accent/50">
                        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Exam window</div>
                        <div className="mt-1 flex items-center justify-between gap-3">
                          <span className="font-display text-base font-semibold">{d.window}</span>
                          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{d.date}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { k: "Registration", v: data.registration.window },
                  { k: "Early bird", v: data.registration.earlyBird },
                  { k: "Final", v: data.registration.final },
                ].map((p) => (
                  <div key={p.k} className="rounded-2xl border border-dashed border-border bg-background p-4">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-accent">{p.k}</div>
                    <div className="mt-1 text-sm font-semibold">{p.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing cards */}
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-[#2a4ea8] p-7 text-primary-foreground shadow-elevated">
                <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/30 blur-3xl" />
                <motion.div
                  aria-hidden
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />
                <span className="relative inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent-foreground">
                  <Sparkles className="h-3 w-3" /> Most picked
                </span>
                <div className="relative mt-4 text-xs uppercase tracking-[0.2em] text-white/70">Early bird registration</div>
                <div className="relative mt-3 flex items-baseline gap-3">
                  <span className="font-display text-4xl font-semibold">{data.fees.early.inr}</span>
                </div>
                <p className="relative mt-3 flex items-center gap-2 text-sm text-white/80">
                  <Tag className="h-4 w-4 text-accent" /> {data.fees.early.note}
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-7 shadow-card transition-all hover-lift">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Standard registration</div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="font-display text-4xl font-semibold">{data.fees.standard.inr}</span>
                </div>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" /> {data.fees.standard.note}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* IMPORTANT DETAILS */}
      <section className="container-px mx-auto max-w-7xl pb-24 md:pb-32">
        <PremiumHeader
          eyebrow="Important details"
          title={<>Everything else you should <GradientAccent>know.</GradientAccent></>}
          description="Quick access to essential course information so you're not chasing answers later."
        />

        <Stagger className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {importantDetails.map((d) => (
            <StaggerItem key={d.t} variants={staggerItemVariants}>
              <a href="#" className="group relative flex h-full items-start gap-4 overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card transition-all hover-lift">
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-accent/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative grid h-14 w-14 shrink-0 place-items-center">
                  <ConicRing size="h-14 w-14" />
                  <div className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow">
                    <d.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-semibold">{d.t}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{d.b}</p>
                </div>
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* CTA */}
      <section className="container-px mx-auto max-w-7xl pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-navy-gradient p-10 text-primary-foreground md:p-16">
          <AmbientDark />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <EyebrowBadge tone="dark">Got doubts?</EyebrowBadge>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                We're just <GradientAccent>one click</GradientAccent> away.
              </h2>
              <p className="mt-5 max-w-xl text-white/75 md:text-lg">
                Talk to a CFA mentor about eligibility, study plan, scholarships and how to pick the right starting level for your background.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-transform hover:scale-[1.02]">
                  Book a free call <ArrowRight className="h-4 w-4" />
                </Link>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur hover:bg-white/20">
                  <Download className="h-4 w-4" /> Download brochure
                </button>
              </div>
            </div>

            <div className="relative mx-auto grid aspect-square w-full max-w-xs place-items-center">
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-full opacity-60"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, hsl(var(--accent)/0.5) 80deg, transparent 160deg, hsl(var(--primary)/0.5) 240deg, transparent 320deg)",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
                }}
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative grid h-full w-full place-items-center rounded-full border border-white/15 bg-white/10 backdrop-blur"
              >
                <div className="text-center text-white">
                  <BookOpen className="mx-auto h-14 w-14 text-accent" />
                  <div className="mt-4 font-display text-3xl font-semibold">{levelLabels[level]}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/70">Currently viewing</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        eyebrow="FAQ"
        title={<>CFA program <span className="italic bg-gradient-to-r from-accent via-accent to-accent/60 bg-clip-text text-transparent">questions.</span></>}
        description="Common questions about levels, eligibility, exam pattern and registration."
      />

    </SiteLayout>
  );
}
