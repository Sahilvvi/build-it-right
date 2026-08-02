import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, ArrowRight, ArrowUpRight, CheckCircle2, Lightbulb, Calendar,
  Target, GraduationCap, Users,
  ScrollText, Phone, Mail, User,
  Sparkles, MessageSquare, ChevronDown,
} from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { faqs } from "@/data/site";


export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "CFA® Prep Program — Fin-Envision Learning" },
      { name: "description", content: "Master the CFA® Program with India's most trusted prep — live mentors, 1,114+ Google reviews at 4.9★. Levels I, II, III with structured curriculum, mocks, doubt clinics and placement support." },
      { property: "og:title", content: "CFA® Prep Program — Fin-Envision Learning" },
      { property: "og:description", content: "Live cohort CFA prep by practitioners. Levels I, II, III. Mocks, doubt clinics, placement support." },
      { property: "og:url", content: "/courses" },
    ],
    links: [{ rel: "canonical", href: "/courses" }],
  }),
  component: CoursesPage,
});

/* ─────────── DATA (unchanged) ─────────── */

const CHAPTER_NAV = [
  { id: "about", label: "About CFA" },
  { id: "level-1", label: "Level 1" },
  { id: "level-2", label: "Level 2" },
  { id: "level-3", label: "Level 3" },
  { id: "pricing", label: "Pricing" },
  
  { id: "retakers", label: "Retakers Pack" },
  { id: "faq", label: "FAQ" },
];

const WHO_ITS_FOR = [
  "Finance professionals seeking recognition and faster career growth.",
  "Career switchers targeting roles in banking, risk, corporate finance.",
  "Students and early-career candidates building a global profile.",
  "Non-finance entrants seeking industry-aligned, benchmarked skills.",
];


const CURRICULUM = {
  "Level I": {
    time: "10–12 months",
    pass: "~37% global pass rate",
    focus: "Tools & foundations",
    topics: [
      { name: "Quantitative Methods", weight: "6–9%", body: "Core quantitative tools and techniques for financial analysis and informed investment decisions — descriptive statistics, probability, and risk." },
      { name: "Economics", weight: "6–9%", body: "Micro and macro foundations: supply and demand, market structures, monetary and fiscal policy, currency exchange rate dynamics." },
      { name: "Alternative Investments", weight: "7–10%", body: "Hedge funds, private equity, real estate, infrastructure, commodities — their risk-return characteristics." },
      { name: "Corporate Issuers", weight: "6–9%", body: "Corporate governance, capital structure, cost of capital, working capital and business models." },
      { name: "Financial Statement Analysis", weight: "11–14%", body: "Reading and interpreting financial statements under IFRS and US GAAP — ratios, quality of earnings." },
      { name: "Equity Investments", weight: "11–14%", body: "Equity markets, valuation techniques, industry and company analysis." },
      { name: "Fixed Income", weight: "11–14%", body: "Bond markets, yield curves, credit risk, securitization and term-structure models." },
      { name: "Derivatives", weight: "5–8%", body: "Forwards, futures, options and swaps — pricing, hedging and applications." },
      { name: "Portfolio Management", weight: "8–12%", body: "Portfolio construction, modern portfolio theory, risk management and the investment policy statement." },
      { name: "Ethical & Professional Standards", weight: "15–20%", body: "CFA Institute Code & Standards — applied to real-world scenarios that every charterholder faces." },
    ],
  },
  "Level II": {
    time: "8–10 months",
    pass: "~44% global pass rate",
    focus: "Asset valuation",
    topics: [
      { name: "Equity Valuation", weight: "10–15%", body: "Deep valuation models — DDM, FCFE, residual income, market-based multiples." },
      { name: "Fixed Income", weight: "10–15%", body: "Term structure models, credit analysis, structured products." },
      { name: "Derivatives", weight: "5–10%", body: "Pricing models, option strategies, swaps and credit derivatives." },
      { name: "Alternative Investments", weight: "5–10%", body: "Private equity, real estate, hedge funds — valuation and due diligence." },
      { name: "Portfolio Management", weight: "10–15%", body: "Asset allocation, risk modelling, behavioural finance." },
      { name: "Corporate Issuers", weight: "5–10%", body: "Capital budgeting, M&A and corporate restructuring." },
      { name: "Financial Statement Analysis", weight: "10–15%", body: "Intercorporate investments, pensions, multinationals." },
      { name: "Economics", weight: "5–10%", body: "Currency, growth and economic regulation." },
      { name: "Quantitative Methods", weight: "5–10%", body: "Regression, time-series and machine learning intros." },
      { name: "Ethical & Professional Standards", weight: "10–15%", body: "Applied ethics across cases and disciplinary scenarios." },
    ],
  },
  "Level III": {
    time: "6–8 months",
    pass: "~48% global pass rate",
    focus: "Portfolio management",
    topics: [
      { name: "Portfolio Management", weight: "35–40%", body: "Asset allocation, currency risk, fixed income & equity portfolio management." },
      { name: "Asset Allocation", weight: "15–20%", body: "Strategic allocation, risk budgeting, factor-based investing." },
      { name: "Fixed Income Portfolios", weight: "15–20%", body: "Liability-driven investing, immunization, multi-asset strategies." },
      { name: "Equity Portfolio Management", weight: "10–15%", body: "Active and passive equity strategies, factor models." },
      { name: "Derivatives & Risk Management", weight: "5–10%", body: "Using derivatives to manage portfolio risk." },
      { name: "Ethical & Professional Standards", weight: "10–15%", body: "GIPS standards plus applied ethics for senior practitioners." },
    ],
  },
} as const;

type Level = keyof typeof CURRICULUM;

const PRICING_TABS = ["Offline (Classroom)", "Online"] as const;

const PLAN_BASE = [
  "Bilingual instruction — English + Hindi",
  "Unlimited views of recorded lectures",
  "100% coverage of the CFA® curriculum",
  "Subject-wise tests and full mock exams",
];

const HOURS_BY_TIER: Record<string, string> = {
  "CFA Level 1": "Live Classroom Interactive Sessions",
  "CFA Level 2": "Live Classroom Interactive Sessions",
  "CFA Level 3": "60+ hours of live teaching",
  "Level 2 Online": "80+ hours of live teaching",
  "Level 3 Online": "60+ hours of live teaching",
};

function includesFor(tier: string): string[] {
  const hours = HOURS_BY_TIER[tier];
  return hours ? [PLAN_BASE[0], hours, ...PLAN_BASE.slice(1)] : PLAN_BASE;
}

const PLANS = {
  "Offline (Classroom)": [
    { tier: "CFA Level 1", price: "₹36,000", note: "140+ hours · Live classroom", popular: true },
    { tier: "CFA Level 2", price: "₹40,000", note: "80+ hours · Live classroom", popular: false },
    { tier: "CFA Level 3", price: "₹25,000", note: "60+ hours · Live classroom", popular: false },
    { tier: "Financial Modelling", price: "₹25,000", note: "Classroom programme · Internship included", popular: false },
  ],
  Online: [
    { tier: "CFA Level 1", price: "₹20,000", note: "140+ hours · Recorded lectures", popular: true },
    { tier: "Level 2 Online", price: "₹25,000", note: "80+ hours · Recorded lectures", popular: false },
    { tier: "Level 3 Online", price: "₹25,000", note: "60+ hours · Recorded lectures", popular: false },
    { tier: "Financial Modelling", price: "₹20,000", note: "Online programme · Full project walkthrough", popular: false },
  ],
} as const;


const IMPORTANT_NOTES = [
  "Earning the CFA Charter requires completing all three exams plus qualifying work experience.",
  "A valid international passport is mandatory for every CFA® exam candidate.",
  "Only TI BA II Plus (and Professional) and HP 12C (all models) calculators are permitted.",
  "Candidates must complete at least one Practical Skill Module (PSM) per level to receive results.",
];

/* ─────────── Shared premium primitives ─────────── */

function AmbientDark() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--accent)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
        }}
      />
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 top-1/3 h-[480px] w-[480px] rounded-full bg-accent/15 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-32 bottom-0 h-[480px] w-[480px] rounded-full bg-primary/35 blur-3xl"
      />
      <div className="absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--accent)/0.12),transparent_70%)] blur-3xl" />
    </div>
  );
}

function AmbientLight() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--primary)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.4) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      <motion.div
        animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-32 top-10 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-32 bottom-10 h-[420px] w-[420px] rounded-full bg-primary/15 blur-3xl"
      />
    </div>
  );
}

function EyebrowBadge({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5 }}
      className={
        "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] backdrop-blur " +
        (dark
          ? "border-accent/30 bg-accent/10 text-accent"
          : "border-accent/30 bg-accent/10 text-accent")
      }
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
      </span>
      {children}
    </motion.span>
  );
}

function GradientHeading({ children, accent, dark = false }: { children: React.ReactNode; accent: React.ReactNode; dark?: boolean }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
      className={
        "mt-5 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-[3.6rem] lg:leading-[1.04] " +
        (dark ? "text-white" : "")
      }
    >
      {children}{" "}
      <span className="italic bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
        {accent}
      </span>
    </motion.h2>
  );
}

/* ─────────── PAGE ─────────── */

function CoursesPage() {
  return (
    <SiteLayout>
      <Hero />
      <Pricing />
      <LeadForm />
      <CourseFaqs />
    </SiteLayout>
  );
}

/* ─────────── HERO ─────────── */

function Hero() {
  return (

    <section className="relative overflow-hidden bg-[hsl(220_55%_12%)] pb-20 pt-14 text-primary-foreground md:pt-20">
      <AmbientDark />

      <div className="container-px relative mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2rem] p-[1px]"
        >
          <span className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/40 via-white/10 to-primary/40" />
          <div className="relative rounded-[calc(2rem-1px)] border border-white/10 bg-[#0b1a36]/80 p-6 backdrop-blur-md md:p-10">
            <div className="grid gap-10">
              {/* Left */}
              <div>
                <div className="flex flex-wrap items-center gap-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">CFA</span>
                    <span className="text-xs font-semibold tracking-wide text-white/90">CFA Institute</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-display text-base font-bold text-white">4.9</span>
                    <span className="text-xs text-white/60">Google Reviews · 1,114 reviews</span>
                  </div>
                </div>

                <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] text-white md:text-6xl lg:text-[4.2rem]">
                  CFA<sup className="text-2xl text-accent">®</sup> Prep{" "}
                  <span className="italic bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
                    Program
                  </span>
                </h1>

                <div className="mt-10 grid gap-6 sm:grid-cols-2">
                  <HeroFact
                    icon={Target}
                    title="Skills You Will Learn"
                    body="Master asset classes and investment tools · Learn portfolio dynamics · Real-world application of ethics."
                  />
                  <HeroFact
                    icon={GraduationCap}
                    title="Outcome"
                    body="Get exam-ready · Apply theory in practice · Build interview-grade fluency."
                  />
                </div>

              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HeroFact({ icon: Icon, title, body }: { icon: any; title: string; body: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="group">
      <div className="flex items-center gap-3">
        <span className="relative grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground shadow-[0_10px_24px_-8px_hsl(var(--accent)/0.7)]">
          <Icon className="h-4 w-4" />
          <span className="absolute -inset-1 rounded-full border border-accent/30 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">{title}</div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/80">{body}</p>
    </motion.div>
  );
}

/* ─────────── CHAPTER NAV ─────────── */

function ChapterNav() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    CHAPTER_NAV.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="sticky top-[64px] z-30 border-y border-border bg-background/85 backdrop-blur-md">
      <div className="container-px mx-auto max-w-7xl">
        <div className="flex gap-7 overflow-x-auto py-4 text-sm font-semibold no-scrollbar">
          {CHAPTER_NAV.map((c) => {
            const isActive = active === c.id;
            return (
              <a
                key={c.id}
                href={`#${c.id}`}
                onClick={() => setActive(c.id)}
                className="relative shrink-0 transition-colors"
              >
                <span className={isActive ? "text-primary" : "text-foreground/55 hover:text-foreground"}>
                  {c.label}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="chapter-active"
                    className="absolute -bottom-[14px] left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-accent to-accent/60"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ─────────── ABOUT ─────────── */

function AboutCFA() {
  return (
    <section id="about" className="relative overflow-hidden scroll-mt-32 py-24 md:py-32">
      <AmbientLight />
      <div className="container-px relative mx-auto max-w-7xl">
        <EyebrowBadge>The Credential</EyebrowBadge>
        <GradientHeading accent="CFA Program?">What is the</GradientHeading>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
          The Chartered Financial Analyst (CFA)® designation is a globally recognized credential in investment management. Awarded by CFA Institute, it develops skills in valuation, portfolio management, and ethics. Earning the Charter requires passing three exams (Levels I–III) and meeting qualifying work requirements.
        </p>

        <div className="mt-14">
          <h3 className="font-display text-2xl font-semibold tracking-tight">Who is it for?</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {WHO_ITS_FOR.map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:border-accent/40 hover:shadow-[0_24px_48px_-24px_hsl(var(--accent)/0.45)]"
              >
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-accent/15 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Users className="h-5 w-5" />
                  <span className="absolute -inset-1 rounded-xl border border-accent/30 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
                <p className="mt-4 text-sm leading-relaxed text-foreground/85">{t}</p>
                <div className="mt-4 font-display text-4xl font-bold text-primary/10 transition-colors group-hover:text-primary/25">
                  0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────── CURRICULUM ─────────── */

function Curriculum() {
  const [level, setLevel] = useState<Level>("Level I");
  const data = CURRICULUM[level];

  return (
    <section id="level-1" className="relative overflow-hidden scroll-mt-32 py-24 md:py-32">
      <AmbientLight />
      <div className="container-px relative mx-auto max-w-7xl">
        <EyebrowBadge>Syllabus</EyebrowBadge>
        <GradientHeading accent="Curriculum">CFA® Program</GradientHeading>
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Three exams — Levels I, II, and III — build from core tools to asset valuation and, finally, portfolio management and ethics. Syllabus evolves; weights may change by exam cycle. Always check CFA Institute.
        </p>

        {/* Premium gradient-bordered level tabs */}
        <div id={level === "Level II" ? "level-2" : level === "Level III" ? "level-3" : undefined} className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="relative inline-flex overflow-hidden rounded-full p-[1px]"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/40 via-primary/30 to-accent/40" />
            <div className="relative flex rounded-full bg-card p-1.5 backdrop-blur-xl">
              {(Object.keys(CURRICULUM) as Level[]).map((l) => {
                const isActive = l === level;
                return (
                  <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className="relative px-6 py-2.5 text-sm font-bold transition-colors"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="curr-tab"
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-[#2a4ea8] shadow-[0_10px_24px_-8px_hsl(var(--primary)/0.7)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={"relative z-10 " + (isActive ? "text-primary-foreground" : "text-foreground/70")}>
                      {l}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={level}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45 }}
          >
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Typical study time", data.time],
                ["Pass rate", data.pass],
                ["Focus", data.focus],
              ].map(([k, v]) => (
                <div key={k} className="group relative overflow-hidden rounded-2xl border border-border bg-card px-5 py-5 shadow-soft transition-all hover:border-accent/40 hover:shadow-[0_18px_36px_-18px_hsl(var(--accent)/0.45)]">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-accent/12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">{k}</div>
                  <div className="mt-1.5 font-display text-lg font-semibold">{v}</div>
                </div>
              ))}
            </div>

            {/* Topic cards with conic-gradient rings */}
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {data.topics.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:border-accent/40 hover:shadow-[0_24px_48px_-24px_hsl(var(--accent)/0.5)]"
                >
                  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute right-5 top-5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent backdrop-blur">
                    {t.weight}
                  </div>

                  <div className="relative grid h-14 w-14 place-items-center">
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full opacity-60"
                      style={{
                        background:
                          "conic-gradient(from 0deg, hsl(var(--primary)/0.5), hsl(var(--accent)/0.6), transparent 60%, hsl(var(--primary)/0.5))",
                      }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative grid h-12 w-12 place-items-center rounded-full bg-card font-display text-xl font-bold text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-lg font-semibold tracking-tight">{t.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
                  <div className="pointer-events-none absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─────────── IMPORTANT NOTE ─────────── */

function ImportantNote() {
  return (
    <section className="container-px mx-auto max-w-7xl py-16">
      <motion.div
        initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-[2rem] p-[1px]"
      >
        <span className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/50 via-accent/10 to-accent/40" />
        <div className="relative overflow-hidden rounded-[calc(2rem-1px)] bg-accent/[0.06] p-8 backdrop-blur md:p-10">
          <motion.div
            animate={{ x: [0, 18, 0], y: [0, -12, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/20 blur-3xl"
          />
          <div className="flex items-center gap-4">
            <span className="relative grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-[0_14px_28px_-10px_hsl(var(--accent)/0.7)]">
              <Lightbulb className="h-6 w-6" />
            </span>
            <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">Important Note</h3>
          </div>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {IMPORTANT_NOTES.map((n, i) => (
              <motion.li
                key={n}
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex items-start gap-3 rounded-xl border border-accent/20 bg-background/70 p-4 text-sm leading-relaxed text-foreground/85 backdrop-blur transition-colors hover:border-accent/40"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {n}
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

/* ─────────── PLAN EXAM ─────────── */

function PlanExam() {
  const [tab, setTab] = useState<Level>("Level I");
  const sections = [
    { letter: "A", title: "Exam Pattern", body: "Two 135-minute sessions of multiple-choice questions covering all 10 topics. Computer-based, delivered at Prometric centres globally." },
    { letter: "B", title: "Exam Periods", body: "Three windows per year — February, May, August, and November (subject to level)." },
    { letter: "C", title: "Registration Fee", body: "Early: $940 · Standard: $1,290 per level. Coaching fees are shared on enquiry." },
  ];

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      <AmbientLight />
      <div className="container-px relative mx-auto max-w-7xl">
        <EyebrowBadge>Exam Strategy</EyebrowBadge>
        <GradientHeading accent="Exam Attempt">Plan Your</GradientHeading>

        <div className="mt-10 relative inline-flex overflow-hidden rounded-full p-[1px]">
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/40 via-primary/30 to-accent/40" />
          <div className="relative flex rounded-full bg-card p-1.5">
            {(Object.keys(CURRICULUM) as Level[]).map((l) => {
              const isActive = l === tab;
              return (
                <button
                  key={l}
                  onClick={() => setTab(l)}
                  className="relative px-6 py-2.5 text-sm font-bold transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="plan-tab"
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-accent/80 shadow-[0_10px_24px_-8px_hsl(var(--accent)/0.7)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={"relative z-10 " + (isActive ? "text-accent-foreground" : "text-foreground/70")}>
                    {l}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {sections.map((s, i) => (
            <motion.div
              key={s.letter}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:border-accent/40 hover:shadow-[0_24px_48px_-24px_hsl(var(--accent)/0.45)]"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <div className="flex items-center gap-3">
                <div className="relative grid h-12 w-12 place-items-center">
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-xl opacity-50"
                    style={{
                      background:
                        "conic-gradient(from 0deg, hsl(var(--primary)/0.6), hsl(var(--accent)/0.6), transparent 60%, hsl(var(--primary)/0.6))",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative grid h-10 w-10 place-items-center rounded-xl bg-card font-display text-base font-bold text-primary">
                    {s.letter}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative mt-10 overflow-hidden rounded-[2rem] p-[1px]"
        >
          <span className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/50 via-white/10 to-primary/40" />
          <div className="relative grid gap-6 rounded-[calc(2rem-1px)] bg-navy-gradient p-8 text-primary-foreground md:grid-cols-[1.5fr_1fr] md:items-center md:p-10">
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
                <Sparkles className="h-3 w-3" /> From Knowing to Doing
              </div>
              <h3 className="mt-3 font-display text-2xl font-semibold text-white md:text-3xl">
                Make the rest{" "}
                <span className="italic bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
                  easier.
                </span>
              </h3>
              <p className="mt-3 text-white/75">
                See how our mentors, doubt-solving, and mock exams shape your prep — and keep you on track.
              </p>
            </div>
            <a
              href="https://www.cfainstitute.org/programs/cfa-program"
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-accent-foreground shadow-[0_18px_36px_-12px_hsl(var(--accent)/0.7)] transition-transform hover:scale-[1.03] md:justify-self-end"
            >
              Check CFA Official Website <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────── PRICING ─────────── */

function Pricing() {
  const [tab, setTab] = useState<typeof PRICING_TABS[number]>("Offline (Classroom)");
  const plans = PLANS[tab];

  return (
    <section id="pricing" className="relative overflow-hidden bg-secondary/40 scroll-mt-32 py-24 md:py-32">
      <div className="pointer-events-none absolute -right-32 top-1/4 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />

      <div className="container-px relative mx-auto max-w-7xl">
        <EyebrowBadge>Investment</EyebrowBadge>
        <GradientHeading accent="Packages">Pricing &</GradientHeading>
        <p className="mt-5 max-w-2xl text-base text-muted-foreground">
          Single-level packs to jump in, or combo bundles for the full Charter journey — built for serious learners.
        </p>

        <div className="mt-10 relative inline-flex overflow-hidden rounded-full p-[1px]">
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/40 via-primary/30 to-accent/40" />
          <div className="relative flex rounded-full bg-card p-1.5">
            {PRICING_TABS.map((t) => {
              const isActive = t === tab;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="relative px-6 py-2.5 text-sm font-bold transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="pricing-tab"
                      className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-[#2a4ea8] shadow-[0_10px_24px_-8px_hsl(var(--primary)/0.7)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={"relative z-10 " + (isActive ? "text-primary-foreground" : "text-foreground/70")}>
                    {t}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="mt-10 grid gap-6 lg:grid-cols-3"
          >
            {plans.map((p, i) => (
              <motion.div
                id={p.tier.toLowerCase().includes("retak") ? "retakers" : undefined}
                key={p.tier}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.55, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className={
                  "group relative overflow-hidden rounded-3xl p-[1px] transition-all " +
                  (p.popular ? "shadow-[0_30px_60px_-20px_hsl(var(--accent)/0.55)]" : "")
                }
              >
                <span
                  className={
                    "absolute inset-0 rounded-3xl " +
                    (p.popular
                      ? "bg-gradient-to-br from-accent via-accent/40 to-primary/40"
                      : "bg-border")
                  }
                />
                <div
                  className={
                    "relative h-full overflow-hidden rounded-[calc(1.5rem-1px)] p-7 " +
                    (p.popular
                      ? "bg-gradient-to-br from-primary to-[#2a4ea8] text-primary-foreground"
                      : "bg-card transition-colors group-hover:bg-card/90")
                  }
                >
                  {p.popular && (
                    <>
                      <motion.div
                        animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/30 blur-3xl"
                      />
                      <div className="absolute right-5 top-5 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground shadow-[0_10px_24px_-8px_hsl(var(--accent)/0.7)]">
                        <Sparkles className="h-3 w-3" /> Most Picked
                      </div>
                    </>
                  )}

                  <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
                    {tab}
                  </div>
                  <h3 className={"mt-2 font-display text-2xl font-semibold " + (p.popular ? "text-white" : "")}>
                    {p.tier}
                  </h3>
                  <div className={"mt-4 font-display text-4xl font-bold " + (p.popular ? "text-white" : "text-primary")}>
                    {p.price}
                  </div>
                  <div className={"mt-2 text-sm " + (p.popular ? "text-white/70" : "text-muted-foreground")}>
                    {p.note}
                  </div>

                  <ul className={"mt-6 space-y-2.5 text-sm " + (p.popular ? "text-white/85" : "text-foreground/80")}>
                    {includesFor(p.tier).map((inc) => (
                      <li key={inc} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {inc}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className={
                      "group/btn mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-xs font-bold uppercase tracking-[0.18em] transition-all " +
                      (p.popular
                        ? "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-[0_16px_32px_-12px_hsl(var(--accent)/0.7)]"
                        : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_16px_32px_-12px_hsl(var(--primary)/0.6)]")
                    }
                  >
                    Enroll Now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}

/* ─────────── LEAD FORM ─────────── */

function LeadForm() {
  return (
    <section className="relative overflow-hidden bg-[hsl(220_55%_12%)] py-24 text-primary-foreground md:py-32">
      <AmbientDark />

      <div className="container-px relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <EyebrowBadge dark>Talk to a counsellor</EyebrowBadge>
          <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-[3.4rem]">
            Your goals,{" "}
            <span className="italic bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
              our plans.
            </span>
          </h2>
          <p className="mt-5 max-w-md text-base text-white/70">
            A 20-minute, no-pressure call to map your goal and the fastest route to your CFA Charter.
          </p>

          <div className="mt-8 space-y-3 text-sm text-white/75">
            {[
              "Personalised level + pack recommendation",
              "Free study calendar tailored to your exam window",
              "Honest answers — even if Fin-Envision Learning isn't your best fit",
            ].map((p, i) => (
              <motion.div
                key={p}
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-start gap-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                {p}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] p-[1px]"
        >
          <span className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/50 via-white/10 to-primary/40" />
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative rounded-[calc(2rem-1px)] border border-white/10 bg-[#0b1a36]/80 p-8 backdrop-blur-md md:p-10"
          >
            <div className="grid gap-5">
              <FormField icon={User} label="Full Name" placeholder="Your full name" required />
              <FormField icon={Mail} label="Email" type="email" placeholder="you@work.com" required />
              <FormField icon={Phone} label="Phone Number" type="tel" placeholder="+91 7304833625" />
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Drop a Message</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your goal…"
                  className="mt-2 w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-accent/60 focus:outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent py-4 text-sm font-bold uppercase tracking-[0.18em] text-accent-foreground shadow-[0_20px_40px_-12px_hsl(var(--accent)/0.7)]"
              >
                Request a Call Back <ArrowRight className="h-4 w-4" />
              </motion.button>
              <div className="text-center text-[11px] text-white/45">
                We respond within 4 working hours. No spam — ever.
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function FormField({ icon: Icon, label, type = "text", placeholder, required }: { icon: any; label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">
        {label}{required && <span className="text-accent"> *</span>}
      </label>
      <div className="relative mt-2">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          className="h-12 w-full rounded-full border border-white/15 bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-white/40 transition-colors focus:border-accent/60 focus:outline-none"
        />
      </div>
    </div>
  );
}

/* ─────────── FAQ — premium two-column ─────────── */

function CourseFaqs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative overflow-hidden scroll-mt-32 py-24 md:py-32">
      <AmbientLight />

      <div className="container-px relative mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <EyebrowBadge>Questions, answered</EyebrowBadge>
          <GradientHeading accent="Asked.">Frequently</GradientHeading>
          <p className="mt-5 max-w-md text-base text-muted-foreground">
            Straight answers about the CFA® Program and studying with Fin-Envision Learning.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.55 }}
            className="mt-8 group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:border-accent/40 hover:shadow-[0_24px_48px_-24px_hsl(var(--accent)/0.45)]"
          >
            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground shadow-[0_10px_24px_-8px_hsl(var(--accent)/0.7)]">
              <MessageSquare className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold">Still curious?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Talk to a counsellor for a quick, no-pressure walkthrough.
            </p>
            <Link
              to="/contact"
              className="group/btn mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent"
            >
              Talk to a counsellor <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        <ol className="space-y-4">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={f.q}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.5, delay: (i % 5) * 0.05 }}
              >
                <div className="relative overflow-hidden rounded-2xl p-[1px]">
                  <motion.span
                    className="absolute inset-0 rounded-2xl"
                    animate={{
                      background: isOpen
                        ? "linear-gradient(135deg, hsl(var(--accent)/0.6), hsl(var(--primary)/0.4))"
                        : "hsl(var(--border))",
                    }}
                    transition={{ duration: 0.4 }}
                  />
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="relative grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-5 rounded-[calc(1rem-1px)] bg-card p-6 text-left transition-colors hover:bg-card/80"
                  >
                    <div className="relative grid h-12 w-12 place-items-center">
                      <motion.span
                        aria-hidden
                        className="absolute inset-0 rounded-full opacity-60"
                        style={{
                          background:
                            "conic-gradient(from 0deg, hsl(var(--primary)/0.5), hsl(var(--accent)/0.6), transparent 60%, hsl(var(--primary)/0.5))",
                        }}
                        animate={{ rotate: isOpen ? 360 : 0 }}
                        transition={{ duration: 10, repeat: isOpen ? Infinity : 0, ease: "linear" }}
                      />
                      <span className="relative grid h-10 w-10 place-items-center rounded-full bg-card font-display text-sm font-bold text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-accent">Q.</div>
                      <div className="mt-1 font-display text-base font-semibold md:text-lg">{f.q}</div>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="mt-3 border-l-2 border-accent/60 pl-4 text-sm leading-relaxed text-muted-foreground">
                              {f.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className={
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors " +
                        (isOpen ? "border-accent bg-accent text-accent-foreground" : "border-border text-foreground/60")
                      }
                    >
                      <ChevronDown className="h-4 w-4" />
                    </motion.span>
                  </button>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>

      {/* unused icon retention to keep imports stable */}
      <span className="hidden"><ScrollText /></span>
    </section>
  );
}
