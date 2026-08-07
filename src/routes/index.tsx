import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, Quote, MonitorPlay, Sparkles, BookOpen, GraduationCap, Briefcase, Crown, Star, Rocket, ClipboardList, Users, Target, Trophy, ChevronLeft, ChevronRight, Play, BarChart3, MessageSquare, Apple, Smartphone } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { FadeIn } from "@/components/site/primitives";
import { CompaniesMarquee } from "@/components/site/Marquee";
import { FAQ } from "@/components/site/FAQ";
import { courses, testimonials, hiringCompanies, brand, faqs, stats, whyUs, googleReviewsCount, googleRating } from "@/data/site";
const FOUNDER_PHOTO = "/manoj-rajgopal.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Fin-Envision Learning — Learn What Finance Really Feels Like" },
      { name: "description", content: "Fin-Envision Learning — leading CFA® classes in Mumbai. CFA® Level 1, 2, 3 and Financial Modeling, taught by Manoj Rajgopal, CFA®. 90% success rate, 1,500+ students trained." },
      { property: "og:title", content: "Fin-Envision Learning — Learn What Finance Really Feels Like" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <Hero />
      
      <WhyUs />
      <CourseTabs />
      <PlacementAnalytics />
      <FounderSpotlight />
      <TestimonialsSection />
      
      <DownloadApp />
      <CompaniesSection />
      <FAQ />
      <FinalCta />
    </SiteLayout>
  );
}

/* ─────────────────────────  WHY US · 3 PILLARS  ───────────────────────── */

function WhyUs() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Why Fin-Envision
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-5xl">
              Three pillars that shape{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                every learner.
              </span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              A learning system built on depth, real-world practice, and{" "}
              <span className="font-serif italic text-accent">personal guidance</span>.
            </p>
          </div>
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {whyUs.map((p, i) => {
            const dashOffset = 40 + i * 40;
            return (
              <FadeIn key={p.title} delay={i * 0.1}>
                <div className="group relative h-full rounded-2xl p-[1px] transition-all duration-500 hover:-translate-y-2">
                  {/* Gradient border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/40 via-primary/10 to-accent/30 opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                  {/* Sheen sweep */}
                  <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full" />
                  </div>

                  <div className="relative flex h-full flex-col rounded-2xl bg-card/80 p-8 backdrop-blur-xl">
                    <div className="relative mb-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent font-display text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20">
                        0{i + 1}
                      </div>
                      <svg
                        aria-hidden
                        className="absolute -left-1 -top-1 h-14 w-14 -rotate-90 opacity-50 transition-transform duration-700 group-hover:rotate-[270deg]"
                        viewBox="0 0 56 56"
                      >
                        <circle
                          cx="28"
                          cy="28"
                          r="26"
                          fill="none"
                          strokeWidth="1"
                          className="stroke-primary"
                          strokeDasharray="163"
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <h3 className="mb-3 font-display text-xl font-semibold leading-tight text-foreground">
                      {p.title}
                    </h3>
                    <p className="mb-6 flex-grow text-sm leading-relaxed text-muted-foreground">
                      {p.body}
                    </p>

                    <div className="mb-5 h-px w-full bg-gradient-to-r from-primary/30 via-accent/20 to-transparent" />

                    <ul className="space-y-3">
                      {p.items?.map((it) => (
                        <li key={it} className="flex items-start gap-3 text-sm text-foreground/85">
                          <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            style={{ boxShadow: "0 0 8px hsl(var(--accent) / 0.7)" }}
                          />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────  HERO  ───────────────────────── */

const HERO_STATS = [
  { icon: Rocket, value: "80–90%", label: "Success rate" },
  { icon: GraduationCap, value: "5,000+", label: "Students trained" },
  { icon: Target, value: "Affordable", label: "Transparent pricing" },
  { icon: Briefcase, value: "Placement", label: "Support & guidance" },
];

function HeroEnquiryForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", course: "" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Fin-Envision, I'd like to enquire.%0AName: ${encodeURIComponent(
      form.name.trim().slice(0, 100),
    )}%0AEmail: ${encodeURIComponent(form.email.trim().slice(0, 120))}%0APhone: ${encodeURIComponent(
      form.phone.trim().slice(0, 20),
    )}%0ACourse: ${encodeURIComponent(form.course.trim().slice(0, 300))}`;
    window.open(`https://wa.me/${brand.whatsapp.replace(/\D/g, "")}?text=${text}`, "_blank", "noopener");
  };

  const field =
    "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/55 outline-none transition focus:border-primary/60 focus:bg-white/15 focus:ring-2 focus:ring-primary/30";

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25 }}
      className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl md:p-7"
    >
      <div className="pointer-events-none absolute inset-x-6 -top-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <p className="mb-1 font-display text-lg font-semibold text-white">Enquire now</p>
      <p className="mb-5 text-xs text-white/65">Get batch dates, fees and a free counselling call.</p>

      <div className="space-y-3">
        <input
          required maxLength={100} className={field} placeholder="Name"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required type="email" maxLength={120} className={field} placeholder="Email"
          value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required type="tel" maxLength={20} className={field} placeholder="Phone number"
          value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <textarea
          rows={3} maxLength={300} className={cn(field, "resize-none")}
          placeholder="Which course are you looking for?"
          value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:shadow-xl hover:shadow-primary/35"
      >
        Enquire Now
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </motion.form>
  );
}

function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-black pb-24 pt-28 md:pb-32 md:pt-36">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,hsl(var(--primary)/0.28),transparent_60%),radial-gradient(ellipse_at_85%_70%,hsl(var(--accent)/0.22),transparent_60%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      <div aria-hidden className="absolute -left-32 top-1/4 h-[520px] w-[520px] rounded-full bg-primary/25 blur-[140px]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            CFA® & Financial Modeling · Mumbai
          </div>

          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
            Your Path to CFA®{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Success Starts Here.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base text-white/75 md:text-lg">
            Your future is secured with our proven track record — concept-first teaching,
            complete curriculum coverage and mentorship until exam day.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
            <span className="text-sm font-semibold text-white">Excellent</span>
            <span className="flex items-center gap-0.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </span>
            <span className="text-sm text-white/75">{googleReviewsCount} Google reviews</span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/courses"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:shadow-xl hover:shadow-primary/35"
            >
              Explore Courses
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              Talk to a mentor
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        <div className="flex justify-center lg:justify-end">
          <HeroEnquiryForm />
        </div>
      </div>

      {/* Stats strip */}
      <div className="relative mx-auto mt-14 max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-2xl md:grid-cols-4"
        >
          {HERO_STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 px-5 py-6 text-center">
              <Icon className="h-5 w-5 text-accent" />
              <p className="font-display text-lg font-semibold text-white">{value}</p>
              <p className="text-xs text-white/65">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────  COURSE TABS  ───────────────────── */

const COURSE_FILTERS = [
  { key: "all", label: "All Courses" },
  { key: "cfa", label: "CFA® Program" },
  { key: "financial-modeling", label: "Financial Modeling" },
] as const;

// Per-course visual identity
const COURSE_THEMES = [
  {
    icon: Crown,
    eyebrow: "Flagship Track",
    accent: "from-[#3b6fd6] via-[#4f7edb] to-[#79a2ff]",
    glow: "shadow-[0_30px_80px_-30px_rgba(79,126,219,0.55)]",
    chip: "bg-[#3b6fd6] text-white",
    ring: "ring-[#4f7edb]/30",
    soft: "bg-[#3b6fd6]/10 text-[#3b6fd6]",
  },
  {
    icon: BarChart3,
    eyebrow: "Advanced Track",
    accent: "from-[#1f9d72] via-[#34c896] to-[#7be1bb]",
    glow: "shadow-[0_30px_80px_-30px_rgba(52,200,150,0.5)]",
    chip: "bg-[#1f9d72] text-white",
    ring: "ring-[#34c896]/30",
    soft: "bg-[#1f9d72]/10 text-[#1f9d72]",
  },
  {
    icon: Target,
    eyebrow: "Mastery Track",
    accent: "from-[#c9851a] via-[#e0a93e] to-[#f5d27a]",
    glow: "shadow-[0_30px_80px_-30px_rgba(224,169,62,0.55)]",
    chip: "bg-[#c9851a] text-white",
    ring: "ring-[#e0a93e]/30",
    soft: "bg-[#c9851a]/10 text-[#c9851a]",
  },
  {
    icon: Briefcase,
    eyebrow: "Internship Programme",
    accent: "from-[#c14a72] via-[#e0648f] to-[#f59ab5]",
    glow: "shadow-[0_30px_80px_-30px_rgba(224,100,143,0.55)]",
    chip: "bg-[#c14a72] text-white",
    ring: "ring-[#e0648f]/30",
    soft: "bg-[#c14a72]/10 text-[#c14a72]",
  },
] as const;

function CourseTabs() {
  const [active, setActive] = useState<typeof COURSE_FILTERS[number]["key"]>("all");
  const list = active === "all" ? courses : courses.filter((c) => c.category === active);

  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,126,219,0.18),transparent_70%)]" />
        <div className="absolute -left-32 bottom-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(224,169,62,0.14),transparent_70%)]" />
      </div>

      <div className="container-px mx-auto max-w-7xl">
        <FadeIn>
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/70 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Our Programmes
            </span>
            <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-[3.5rem]">
              Courses designed for{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-primary via-[#4f7edb] to-accent bg-clip-text text-transparent">real-world</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1.5 -z-0 h-3 -skew-x-6 bg-accent/25" />
              </span>{" "}
              financial skills
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
              Concept-first teaching. 100% institute curriculum solved in class. Taught by Manoj Rajgopal, CFA® — every formula, every chart, every "why".
            </p>
          </div>
        </FadeIn>

        {/* Filter pill bar */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-border/60 bg-background/70 p-1.5 shadow-soft backdrop-blur">
            {COURSE_FILTERS.map((f) => {
              const isActive = active === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setActive(f.key)}
                  className="relative rounded-full px-4 py-2 text-[13px] font-semibold tracking-wide transition-colors md:text-[13.5px]"
                >
                  {isActive && (
                    <motion.span
                      layoutId="course-tab-pill"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 ${isActive ? "text-background" : "text-foreground/70 hover:text-foreground"}`}>
                    {f.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards grid */}
        <motion.div layout className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.slice(0, 4).map((c, i) => {
              const t = COURSE_THEMES[i % COURSE_THEMES.length];
              const Icon = t.icon;
              const topHighlights = c.highlights.slice(0, 3);
              return (
                <motion.article
                  key={c.slug}
                  layout
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -10 }}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-card p-7 shadow-soft transition-all duration-500 hover:shadow-elevated"
                >
                  {/* gradient border glow on hover */}
                  <div aria-hidden className={`pointer-events-none absolute -inset-[1px] rounded-[1.75rem] bg-gradient-to-br ${t.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-60`} style={{ WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude", padding: "1px" }} />
                  {/* corner glow */}
                  <div aria-hidden className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-to-br ${t.accent} opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-25`} />

                  {/* Index number watermark */}
                  <span aria-hidden className="pointer-events-none absolute -right-2 top-2 font-display text-[7rem] font-black leading-none tracking-tighter text-foreground/[0.04] transition-transform duration-700 group-hover:scale-110 group-hover:text-foreground/[0.06]">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Top: icon orb + badge */}
                  <div className="relative flex items-start justify-between gap-3">
                    <motion.div
                      aria-hidden
                      initial={{ rotate: -8, scale: 0.85, opacity: 0 }}
                      whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ rotate: 6, scale: 1.08 }}
                      className={`relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${t.accent} text-white ${t.glow}`}
                    >
                      <Icon className="h-6 w-6" strokeWidth={2.2} />
                      <span aria-hidden className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/30" />
                    </motion.div>
                    {c.badge && (
                      <span className={`inline-flex max-w-[55%] rounded-full px-3 py-1.5 text-right text-[10px] font-bold uppercase leading-tight tracking-[0.14em] ${t.chip} shadow-soft`}>
                        {c.badge}
                      </span>
                    )}
                  </div>

                  {/* Eyebrow + title */}
                  <p className={`relative mt-7 inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.22em] ${t.soft.replace("bg-", "text-").split(" ")[1]}`}>
                    {t.eyebrow}
                  </p>
                  <h3 className="relative mt-2 font-display text-[1.5rem] font-semibold leading-[1.15] tracking-tight text-foreground">
                    {c.title}
                  </h3>

                  {/* Meta */}
                  <div className="relative mt-4 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${t.soft}`}>
                      <MonitorPlay className="h-3 w-3" />
                      {c.format}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/60 px-2.5 py-1 text-[11px] font-semibold text-foreground/75">
                      <GraduationCap className="h-3 w-3" />
                      {c.level}
                    </span>
                  </div>

                  {/* Body */}
                  <p className="relative mt-4 line-clamp-3 text-[13.5px] leading-relaxed text-muted-foreground">
                    {c.outcomes[0]}
                  </p>

                  {/* Highlights — reveal on hover */}
                  <ul className="relative mt-4 space-y-1.5 overflow-hidden">
                    {topHighlights.map((h, hi) => (
                      <li
                        key={hi}
                        className="flex items-start gap-2 text-[12.5px] leading-snug text-foreground/75 opacity-70 transition-all duration-500 group-hover:opacity-100"
                        style={{ transitionDelay: `${hi * 70}ms` }}
                      >
                        <span className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br ${t.accent}`} />
                        <span className="line-clamp-1">{h}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Footer: price + CTA */}
                  <div className="relative mt-auto flex items-end justify-between gap-3 pt-7">
                    <div>
                      <div className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Fees</div>
                      <div className="mt-0.5 font-display text-[15px] font-bold leading-tight text-foreground">
                        {c.price}
                      </div>
                    </div>
                    <Link
                      to="/courses"
                      aria-label={`Explore ${c.title}`}
                      className={`group/btn grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br ${t.accent} text-white shadow-soft transition-transform hover:scale-110`}
                    >
                      <ArrowUpRight className="h-5 w-5 transition-transform group-hover/btn:rotate-12" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* View all CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            to="/courses"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-foreground/15 bg-background px-6 py-3 text-sm font-semibold tracking-wide text-foreground transition-all hover:border-foreground/30 hover:shadow-soft"
          >
            Explore all programmes
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}



/* ─────────────────  PLACEMENT ANALYTICS  ───────────────── */

const PLACEMENT_BARS = [12, 22, 35, 48, 62, 78, 92];

function CountUp({ to, suffix = "", prefix = "", duration = 1.6 }: { to: number; suffix?: string; prefix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

function Ring({ value, label, sub, progress = 0.82 }: { value: React.ReactNode; label: string; sub?: string; progress?: number }) {
  const C = 2 * Math.PI * 52;
  return (
    <div className="relative mx-auto grid h-36 w-36 place-items-center">
      <div className="absolute inset-2 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.22),transparent_70%)] blur-xl" />
      <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
        <circle cx="60" cy="60" r="52" stroke="hsl(var(--border))" strokeOpacity="0.35" strokeWidth="6" fill="none" />
        <motion.circle
          cx="60" cy="60" r="52" fill="none"
          stroke="url(#ringGrad)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          whileInView={{ strokeDashoffset: C * (1 - progress) }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: "drop-shadow(0 0 8px hsl(var(--accent)/0.55))" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative text-center">
        <div className="font-display text-[1.6rem] font-bold leading-none bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">{value}</div>
        {sub && <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{sub}</div>}
      </div>
      <span className="sr-only">{label}</span>
    </div>
  );
}

function PremiumCard({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative overflow-hidden rounded-[28px] p-[1px]",
        "bg-gradient-to-br from-primary/40 via-border/40 to-accent/30",
        "shadow-[0_10px_40px_-15px_hsl(var(--primary)/0.35)]",
        "transition-shadow hover:shadow-[0_18px_60px_-15px_hsl(var(--primary)/0.55)]",
        className
      )}
    >
      <div className="relative h-full rounded-[27px] bg-card/95 p-7 backdrop-blur-xl">
        {/* corner glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-accent/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {/* sheen */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
        <div className="relative">{children}</div>
      </div>
    </motion.div>
  );
}

function PlacementAnalytics() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/30 via-background to-secondary/40 py-24 md:py-32">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.18),transparent_70%)] blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--accent)/0.15),transparent_70%)] blur-3xl" />
        <div className="absolute -right-40 top-1/3 h-[400px] w-[400px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.12),transparent_70%)] blur-3xl" />
      </div>
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      <div className="container-px relative mx-auto max-w-7xl">
        <FadeIn>
          <motion.div
            initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="mx-auto flex w-fit items-center gap-3 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-accent">Numbers That Matter</p>
          </motion.div>

          <h2 className="mx-auto mt-6 max-w-4xl text-center text-balance font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-[3.6rem] lg:leading-[1.05]">
            <CountUp to={5000} suffix="+" /> Learners{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">Trained.</span>
            <br className="hidden md:block" />{" "}
            <span className="italic text-accent">Results That Speak.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground md:text-lg">
            Eight years of teaching, thousands of success stories, and a track record built on first-attempt clears.
          </p>
        </FadeIn>

        {/* Hero stat + supporting stats */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {/* HERO — Students Trained */}
          <PremiumCard className="lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
              <Ring value={<CountUp to={5000} suffix="+" />} sub="students" label="Students trained" progress={0.9} />
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.28em] text-accent">Since 2017</div>
                <h3 className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  5,000+ Students Trained
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                  Across CFA® Levels I, II, III and Financial Modelling — from first-year undergrads to working professionals switching into finance.
                </p>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {["CFA® L1", "CFA® L2", "CFA® L3", "Financial Modelling"].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary backdrop-blur"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </PremiumCard>

          {/* Success Rate */}
          <PremiumCard delay={0.08}>
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="font-display text-6xl font-bold leading-none">
                <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  <CountUp to={80} />
                </span>
                <span className="text-accent">–90%</span>
              </div>
              <div className="mt-3 text-sm font-semibold text-foreground">Success Rate</div>
              <div className="mt-1 text-xs text-muted-foreground">Consistent pass rates across cohorts</div>

              <svg viewBox="0 0 200 70" className="mt-6 h-20 w-full overflow-visible">
                <defs>
                  <linearGradient id="successFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="successStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0 40 L33 34 L66 30 L100 22 L133 18 L166 12 L200 8 L200 70 L0 70 Z"
                  fill="url(#successFill)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }}
                />
                <motion.path
                  d="M0 40 L33 34 L66 30 L100 22 L133 18 L166 12 L200 8"
                  fill="none" stroke="url(#successStroke)" strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeOut" }}
                  style={{ filter: "drop-shadow(0 2px 6px hsl(var(--accent)/0.45))" }}
                />
              </svg>
            </div>
          </PremiumCard>
        </div>

        {/* Second row — 3 supporting stats */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {/* Google Reviews */}
          <PremiumCard delay={0.12}>
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="inline-flex items-center gap-1 text-accent">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-accent" />
                ))}
              </div>
              <div className="mt-3 font-display text-6xl font-bold leading-none bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                <CountUp to={googleReviewsCount} />
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">Google Reviews</div>
              <div className="mt-1 text-xs text-muted-foreground">Verified feedback from real students</div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/60 px-3 py-1 text-[11px] font-semibold text-foreground/80">
                <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_6px_hsl(var(--accent))]" />
                {googleRating} average rating
              </div>
            </div>
          </PremiumCard>

          {/* Teaching Experience */}
          <PremiumCard delay={0.2}>
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Ring value={<CountUp to={8} suffix="+" />} sub="years" label="Teaching experience" progress={0.8} />
              <h3 className="mt-6 font-display text-lg font-semibold tracking-tight">Teaching Experience</h3>
              <p className="mt-1 text-xs text-muted-foreground">Refined over 8+ years in the classroom</p>
              <div className="mt-4 grid w-full grid-cols-3 gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span className="rounded-md border border-border/60 bg-secondary/60 py-1.5">Live</span>
                <span className="rounded-md border border-border/60 bg-secondary/60 py-1.5">Recorded</span>
                <span className="rounded-md border border-border/60 bg-secondary/60 py-1.5">1:1</span>
              </div>
            </div>
          </PremiumCard>

          {/* Attempt Focus */}
          <PremiumCard delay={0.28}>
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="font-display text-[6rem] font-bold leading-none bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  1
                  <span className="align-super text-3xl">st</span>
                </div>
                <div className="pointer-events-none absolute inset-0 -z-10 blur-2xl bg-primary/20" />
              </div>
              <div className="mt-2 text-sm font-semibold text-foreground">Attempt Focus</div>
              <div className="mt-1 text-xs text-muted-foreground">Structured to clear on the very first try</div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-semibold text-accent">
                <Trophy className="h-3.5 w-3.5" />
                First-attempt mindset
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </section>
  );
}



/* ─────────────────  TESTIMONIALS (quote cards)  ───────────────── */

function TestimonialsSection() {
  return (
    <section className="container-px mx-auto max-w-7xl py-24 md:py-32">
      <FadeIn>
        <h2 className="max-w-3xl text-balance font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
          Why Finance Aspirants <span className="italic text-accent">Vouch for Us</span>...
        </h2>
      </FadeIn>

      <div className="relative mt-14 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max gap-6 animate-marquee">
          {[...testimonials, ...testimonials].map((t, i) => (
            <article
              key={i}
              className="flex w-[360px] flex-col rounded-3xl border border-border bg-card p-7 shadow-soft md:w-[440px]"
            >
              <Quote className="h-9 w-9 text-accent" />
              <p className="mt-5 text-[15px] leading-relaxed text-foreground/85">"{t.quote}"</p>
              <div className="mt-6 border-t border-border pt-5">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Batch · {2018 + (i % 6)}
                </div>
                <div className="mt-1 font-display text-xl font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────  FOUNDER SPOTLIGHT  ───────────────── */

function FounderSpotlight() {
  const journey = [
    "Founder and Lead Instructor of Fin-Envision Learning.",
    "Cleared all three levels of the CFA® Program in the first attempt.",
    "Worked with reputed organizations such as CRISIL and JHP, gaining valuable industry exposure.",
    "Has successfully trained over 5,000 students across Mumbai.",
    "Known for simplifying complex financial concepts into easy-to-understand, practical lessons.",
    "Focuses on bridging the gap between academic learning and real-world finance.",
    "Dedicated to mentoring students for successful careers in finance through industry-oriented training and personalized guidance.",
  ];
  const credentials = ["CFA® Charterholder", "Investment Banking", "Financial Modeling", "Portfolio Strategy"];



  return (
    <section className="relative overflow-hidden bg-background py-24 md:py-32">
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--primary)/0.16),transparent_70%)] blur-3xl" />
        <div className="absolute -right-32 bottom-10 h-[460px] w-[460px] rounded-full bg-[radial-gradient(closest-side,hsl(var(--accent)/0.12),transparent_70%)] blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
        }}
      />

      <div className="container-px relative mx-auto max-w-7xl">
        <FadeIn>
          <motion.div
            initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="flex w-fit items-center gap-3 rounded-full border border-border/60 bg-card/60 px-4 py-1.5 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <p className="text-[11px] font-bold uppercase tracking-[0.32em] text-accent">Lead Instructor</p>
          </motion.div>
          <h2 className="mt-6 max-w-4xl font-display text-4xl font-semibold tracking-tight md:text-5xl lg:text-[3.6rem] lg:leading-[1.05]">
            At the helm of{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">Fin-Envision.</span>
          </h2>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-12 overflow-hidden rounded-[2.5rem] p-[1px]"
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/40 via-border/30 to-accent/40" />
          <div className="relative rounded-[calc(2.5rem-1px)] bg-card/95 p-6 backdrop-blur-xl md:p-12">
            {/* corner glows */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-accent/15 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              {/* Left — Portrait + stats */}
              <div className="lg:sticky lg:top-28">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.7 }}
                  className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary/20 to-accent/10 shadow-elevated"
                >
                  <img
                    src={FOUNDER_PHOTO}
                    alt="Manoj Rajgopal, CFA® — Founder & Lead Instructor at Fin-Envision Learning"
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/90 backdrop-blur">
                      Founder &amp; Lead Instructor
                    </span>
                    <h3 className="mt-3 font-display text-3xl font-bold leading-tight text-white md:text-4xl">
                      Manoj Rajgopal, CFA®
                    </h3>
                  </div>
                </motion.div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {[
                    ["8+", "Years teaching"],
                    ["5,000+", "Students"],
                    ["1st", "Attempt"],
                  ].map(([v, l], i) => (
                    <motion.div
                      key={l}
                      initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
                      whileHover={{ y: -4 }}
                      className="group relative overflow-hidden rounded-2xl p-[1px]"
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 opacity-60 transition-opacity group-hover:opacity-100" />
                      <div className="relative rounded-[15px] bg-card/95 px-3 py-4 text-center backdrop-blur">
                        <div className="font-display text-xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">{v}</div>
                        <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{l}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right — Credentials + journey */}
              <div className="flex flex-col gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-accent/30 to-accent/10 text-accent shadow-[inset_0_0_0_1px_hsl(var(--accent)/0.3)]">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-foreground/80">
                      Academic Credentials
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {credentials.map((c, i) => (
                      <motion.span
                        key={c}
                        initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-card transition-all hover:border-accent/50 hover:text-accent"
                      >
                        {c}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <div className="h-px w-full bg-gradient-to-r from-primary/30 via-accent/20 to-transparent" />

                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Manoj Sir's Journey</div>
                  <ul className="mt-5 space-y-3">
                    {journey.map((w, i) => (
                      <motion.li
                        key={w}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="group flex gap-3 rounded-xl border border-transparent bg-muted/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground transition-colors hover:border-accent/30 hover:bg-muted/60"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-accent to-primary" />
                        <span>{w}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────  YOUR JOURNEY (timeline)  ───────────────── */

const JOURNEY_TRACKS = {
  Overall: [
    { icon: Rocket, badge: "Start", title: "Begin Your Journey", body: "Book a 20-min discovery call and map your goals to the right program." },
    { icon: ClipboardList, badge: "Step 1", title: "Understand the Syllabus & Set Up", body: "Familiarize with CFA® / FRM syllabus, exam structure, and your study setup." },
    { icon: BookOpen, badge: "Step 2", title: "Start & Plan Your Journey", body: "Begin live classes, follow the Lecture Guide, and lock weekly targets." },
    { icon: Users, badge: "Step 3", title: "Engage with Mentors & Track Progress", body: "Connect with your mentor and track every milestone in the Performance Tracker." },
    { icon: Target, badge: "Step 4", title: "Mock Exams & Doubt Clinics", body: "Sharpen with full-length mocks and live weekly doubt clinics." },
    { icon: Trophy, badge: "Outcome", title: "Clear, Get Placed, Lead", body: "Pass the exam, walk into placement support, and grow with the alumni network." },
  ],
  Class: [
    { icon: Rocket, badge: "Start", title: "Cohort Kickoff", body: "Meet your batch, instructors, and set learning rituals together." },
    { icon: ClipboardList, badge: "Step 1", title: "Weekly Modules", body: "Bite-sized lessons, practice sets, and concept maps every week." },
    { icon: BookOpen, badge: "Step 2", title: "Live Doubt Clinics", body: "Resolve concepts with mentors in interactive small-group sessions." },
    { icon: Users, badge: "Step 3", title: "Peer Study Pods", body: "3-5 person pods for accountability, revisions, and mock interviews." },
    { icon: Target, badge: "Step 4", title: "Assessments", body: "Topic mocks + adaptive QBank to know exactly where you stand." },
    { icon: Trophy, badge: "Outcome", title: "Cohort Demo Day", body: "Showcase capstone work to a hiring panel — recruiters in the room." },
  ],
  Institute: [
    { icon: Rocket, badge: "Start", title: "Campus Onboarding", body: "Custom rollout plan for your college or corporate batch." },
    { icon: ClipboardList, badge: "Step 1", title: "Curriculum Mapping", body: "Align with academic calendar, internal credits, and learning outcomes." },
    { icon: BookOpen, badge: "Step 2", title: "Faculty Co-Teach", body: "Joint sessions with your in-house faculty and our practitioner mentors." },
    { icon: Users, badge: "Step 3", title: "Mentor Pool Access", body: "Students get 1:1 access to industry mentors across finance and AI." },
    { icon: Target, badge: "Step 4", title: "Internal Mocks", body: "Custom assessments aligned to placement-season skill demands." },
    { icon: Trophy, badge: "Outcome", title: "Placement Drive", body: "Curated hiring drives with our 180+ partner network." },
  ],
} as const;

type JourneyTab = keyof typeof JOURNEY_TRACKS;
const JOURNEY_TABS: JourneyTab[] = ["Overall", "Class", "Institute"];

function YourJourney() {
  const [tab, setTab] = useState<JourneyTab>("Overall");
  const [start, setStart] = useState(0);
  const steps = JOURNEY_TRACKS[tab];

  const onTab = (t: JourneyTab) => {
    setTab(t);
    setStart(0);
  };


  return (
    <section className="relative overflow-hidden bg-[hsl(220_50%_9%)] py-24 text-primary-foreground md:py-32">
      {/* ambient backdrop */}
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

      <div className="container-px relative mx-auto max-w-7xl">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: -8 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-accent backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            Our Programs
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 font-display text-5xl font-bold tracking-tight md:text-6xl lg:text-[4rem] lg:leading-[1.02]"
          >
            Your{" "}
            <span className="italic bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
              Journey
            </span>
          </motion.h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-white/65 md:text-lg">
            Follow our proven roadmap designed to transform you from beginner to finance professional.
          </p>

          {/* Segmented tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="relative mt-10 inline-flex overflow-hidden rounded-full p-[1px]"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/40 via-white/10 to-primary/40" />
            <div className="relative flex rounded-full bg-[#0a1a35]/90 p-1.5 backdrop-blur-xl">
              {JOURNEY_TABS.map((t) => {
                const isActive = t === tab;
                return (
                  <button
                    key={t}
                    onClick={() => onTab(t)}
                    className="relative rounded-full px-7 py-2.5 text-sm font-semibold transition-colors"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="journey-pill"
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-accent to-accent/80 shadow-[0_8px_24px_-6px_hsl(var(--accent)/0.7)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className={cn("relative z-10 transition-colors", isActive ? "text-accent-foreground" : "text-white/65 hover:text-white")}>
                      {t}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Unique split layout: vertical rail (left) + spotlight detail (right) */}
        <div className="relative mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
          {/* ── Left: vertical milestone rail ── */}
          <div className="relative">
            {/* vertical track */}
            <div className="absolute left-7 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" aria-hidden />
            <motion.div
              key={tab + "-rail"}
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "top" }}
              className="absolute left-7 top-4 bottom-4 w-[2px] rounded-full bg-gradient-to-b from-accent via-accent/70 to-transparent shadow-[0_0_14px_hsl(var(--accent)/0.7)]"
              aria-hidden
            />

            <ul className="space-y-3">
              {steps.map((stp, i) => {
                const Icon = stp.icon;
                const isActive = i === start;
                return (
                  <li key={tab + "-rail-" + stp.title}>
                    <motion.button
                      onClick={() => setStart(i)}
                      initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}
                      whileHover={{ x: 4 }}
                      className={cn(
                        "group relative flex w-full items-center gap-4 rounded-2xl border px-4 py-3.5 text-left backdrop-blur transition-all",
                        isActive
                          ? "border-accent/40 bg-gradient-to-r from-accent/15 via-accent/[0.06] to-transparent shadow-[0_12px_40px_-18px_hsl(var(--accent)/0.7)]"
                          : "border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]"
                      )}
                    >
                      {/* Node */}
                      <span className="relative grid h-10 w-10 shrink-0 place-items-center">
                        <span className={cn(
                          "absolute inset-0 rounded-full p-[1.5px] transition-all",
                          isActive
                            ? "bg-gradient-to-br from-accent via-accent/70 to-primary/60"
                            : "bg-gradient-to-br from-white/20 to-white/5 group-hover:from-accent/40"
                        )}>
                          <span className={cn(
                            "block h-full w-full rounded-full",
                            isActive ? "bg-accent text-accent-foreground" : "bg-[#0a1a35] text-white/75"
                          )} />
                        </span>
                        <Icon className={cn("relative h-4.5 w-4.5", isActive ? "text-accent-foreground" : "text-white/75")} />
                        {isActive && (
                          <motion.span
                            aria-hidden
                            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 rounded-full border border-accent"
                          />
                        )}
                      </span>

                      {/* Label */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.18em]",
                            isActive ? "bg-accent/25 text-accent" : "bg-white/8 text-white/55"
                          )}>
                            {stp.badge}
                          </span>
                          <span className="font-mono text-[10px] text-white/35">
                            {String(i + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                          </span>
                        </div>
                        <div className={cn(
                          "mt-1 truncate font-display text-sm font-semibold transition-colors md:text-[15px]",
                          isActive ? "text-white" : "text-white/75 group-hover:text-white"
                        )}>
                          {stp.title}
                        </div>
                      </div>

                      <ChevronRight className={cn(
                        "h-4 w-4 shrink-0 transition-all",
                        isActive ? "translate-x-0.5 text-accent" : "text-white/30 group-hover:translate-x-1 group-hover:text-white/70"
                      )} />
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* ── Right: Spotlight detail card ── */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {(() => {
                const stp = steps[start];
                const Icon = stp.icon;
                return (
                  <motion.div
                    key={tab + "-spot-" + stp.title}
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -16, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="relative overflow-hidden rounded-[2rem] p-px"
                  >
                    {/* gradient border */}
                    <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-accent/40 via-white/10 to-primary/40" />
                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[hsl(220_55%_13%)] via-[hsl(220_55%_11%)] to-[hsl(220_60%_9%)] p-8 md:p-10">
                      {/* corner orbs */}
                      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
                      <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-primary/25 blur-3xl" />
                      {/* big watermark step number */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute right-6 top-2 select-none font-display text-[180px] font-black leading-none text-white/[0.04] md:text-[220px]"
                      >
                        {String(start + 1).padStart(2, "0")}
                      </span>

                      <div className="relative">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-accent">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            {stp.badge}
                          </span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                            Milestone {start + 1} of {steps.length}
                          </span>
                        </div>

                        {/* Big icon node */}
                        <div className="mt-7 flex items-start gap-5">
                          <motion.div
                            initial={{ rotate: -8, scale: 0.9 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 220, damping: 16 }}
                            className="relative grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent/70 text-accent-foreground shadow-[0_18px_40px_-12px_hsl(var(--accent)/0.7)]"
                          >
                            <Icon className="h-9 w-9" />
                            <motion.span
                              aria-hidden
                              animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                              transition={{ duration: 2.4, repeat: Infinity }}
                              className="absolute inset-0 rounded-2xl border border-accent/60"
                            />
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-display text-2xl font-bold leading-tight text-white md:text-3xl lg:text-[2rem]">
                              {stp.title}
                            </h3>
                            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
                              {stp.body}
                            </p>
                          </div>
                        </div>

                        {/* footer: progress + controls */}
                        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setStart((p) => Math.max(0, p - 1))}
                              disabled={start === 0}
                              aria-label="Previous step"
                              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent disabled:opacity-30"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setStart((p) => Math.min(steps.length - 1, p + 1))}
                              disabled={start >= steps.length - 1}
                              aria-label="Next step"
                              className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/[0.04] text-white/80 transition-all hover:border-accent/50 hover:bg-accent/10 hover:text-accent disabled:opacity-30"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
                              Step {start + 1} / {steps.length}
                            </span>
                          </div>

                          <div className="relative h-1.5 w-44 overflow-hidden rounded-full bg-white/10">
                            <motion.span
                              animate={{ width: `${((start + 1) / steps.length) * 100}%` }}
                              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-accent to-accent/70 shadow-[0_0_10px_hsl(var(--accent))]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────  DOWNLOAD OUR APP  ───────────────── */

const APP_FEATURES = [
  { icon: Play, title: "Lectures", sub: "Interactive video lectures" },
  { icon: ClipboardList, title: "Mock Test", sub: "Simulate real exams" },
  { icon: BarChart3, title: "Practice Test", sub: "Master your skills" },
  { icon: MessageSquare, title: "Doubt Forum", sub: "Get expert help" },
];

function DownloadApp() {
  const [active, setActive] = useState(3);
  const ActiveIcon = APP_FEATURES[active].icon;

  return (
    <section className="relative overflow-hidden bg-[hsl(220_60%_10%)] py-24 text-primary-foreground md:py-32">
      {/* Ambient glows */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-accent/20 blur-[120px]"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-40 bottom-0 h-[560px] w-[560px] rounded-full bg-primary/50 blur-[140px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(hsl(var(--accent))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--accent))_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="container-px relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-accent backdrop-blur"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            On every device
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="mt-5 font-display text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            Download{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">Our App</span>
              <motion.span
                aria-hidden
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.4 }}
                className="absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-gradient-to-r from-accent to-transparent"
              />
            </span>
          </motion.h2>
          <p className="mx-auto mt-5 max-w-md text-base text-white/65">
            Access your courses on any device — anywhere, anytime.
          </p>
        </div>

        {/* Feature pills */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {APP_FEATURES.map((f, i) => {
            const Icon = f.icon;
            const isActive = i === active;
            return (
              <motion.button
                key={f.title}
                onClick={() => setActive(i)}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                {isActive && (
                  <motion.span
                    layoutId="app-feature-active"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/40 via-accent/10 to-primary/30 p-px"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <span className="block h-full w-full rounded-2xl bg-[hsl(220_60%_10%)]" />
                  </motion.span>
                )}
                <div
                  className={
                    "relative flex items-center gap-3 rounded-2xl border px-5 py-4 text-left backdrop-blur transition-all " +
                    (isActive
                      ? "border-transparent bg-white/[0.06] shadow-[0_20px_60px_-20px_hsl(var(--accent)/0.5)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]")
                  }
                >
                  <span
                    className={
                      "relative grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-all " +
                      (isActive
                        ? "bg-gradient-to-br from-accent to-accent/70 text-accent-foreground shadow-[0_8px_24px_-6px_hsl(var(--accent)/0.7)]"
                        : "bg-white/10 text-white/75 group-hover:bg-white/15")
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {isActive && (
                      <motion.span
                        aria-hidden
                        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-xl bg-accent/40"
                      />
                    )}
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-base font-semibold text-white">{f.title}</div>
                    <div className="text-[11px] text-white/55">{f.sub}</div>
                  </div>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="pointer-events-none absolute left-1/2 top-full hidden h-12 w-px -translate-x-1/2 bg-gradient-to-b from-accent/60 to-transparent lg:block"
                    />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-16 overflow-hidden rounded-[2.5rem] p-px"
        >
          {/* Gradient border */}
          <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-accent/40 via-white/10 to-primary/40" />
          <motion.div
            aria-hidden
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1/2 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,hsl(var(--accent)/0.3)_60deg,transparent_120deg)] opacity-40"
          />
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[hsl(220_60%_12%)] via-[hsl(220_55%_14%)] to-[hsl(220_60%_10%)] p-8 backdrop-blur-xl md:p-14">
            {/* corner orbs */}
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />

            <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_1.15fr]">
              {/* Left — copy */}
              <div>
                <motion.span
                  initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-accent shadow-[0_8px_24px_-8px_hsl(var(--accent)/0.6)]"
                >
                  <ActiveIcon className="h-3.5 w-3.5" />
                  {APP_FEATURES[active].title}
                </motion.span>
                <h3 className="mt-6 font-display text-4xl font-bold leading-[1.05] text-white md:text-5xl lg:text-[3.5rem]">
                  Learn Anywhere,<br />
                  <span className="bg-gradient-to-r from-accent via-accent to-accent/60 bg-clip-text text-transparent">
                    Anytime
                  </span>
                </h3>
                <p className="mt-5 max-w-md text-base leading-relaxed text-white/70">
                  Pick up exactly where you left off — across mobile, tablet and desktop. Offline lectures, sync'd notes, mock tests on the go.
                </p>

                <div className="mt-8">
                  <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/55">
                    Try Demo for
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {[
                      { 
                        label: "Android", 
                        Icon: Smartphone, 
                        color: "bg-gradient-to-br from-[#3DDC84] to-[#2bb46a] text-black",
                        href: "https://play.google.com/store/apps/details?id=co.sansa.arwir" 
                      },
                      { 
                        label: "iOS", 
                        Icon: Apple, 
                        color: "bg-gradient-to-br from-white to-slate-200 text-black",
                        href: "https://apps.apple.com/us/app/fin-envision-learning/id6745217545" 
                      },
                      { 
                        label: "Windows", 
                        Icon: MonitorPlay, 
                        color: "bg-gradient-to-br from-[#0078D6] to-[#005a9e] text-white",
                        href: "https://web.classplusapp.com" 
                      },
                    ].map(({ label, Icon, color, href }, idx) => (
                      <motion.a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.3 + idx * 0.08 }}
                        whileHover={{ y: -4, scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        aria-label={`Download for ${label}`}
                        className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/15 bg-white/[0.05] px-4 py-3 backdrop-blur transition-colors hover:border-accent/50 cursor-pointer"
                      >
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                        <span className={`relative grid h-10 w-10 place-items-center rounded-xl shadow-lg ${color}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div className="relative text-left">
                          <div className="text-[9px] uppercase tracking-wider text-white/50">Get it on</div>
                          <div className="text-sm font-semibold text-white">{label}</div>
                        </div>
                      </motion.a>
                    ))}
                  </div>

                  {/* Laptop / PC / iPad Notice */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.55 }}
                    className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm relative overflow-hidden"
                  >
                    <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-accent/5 blur-xl" />
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-accent animate-pulse">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">Laptop / PC / iPad Users</div>
                        <p className="mt-1.5 text-xs text-white/60 leading-relaxed">
                          For video lectures, use the Windows link above and enter Org Code:{" "}
                          <span className="inline-block font-mono bg-white/10 text-accent font-bold px-2 py-0.5 rounded border border-white/10 select-all tracking-wider ml-1">
                            RJQBWG
                          </span>
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Mini stats */}
                <div className="mt-10 flex flex-wrap gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur">
                  {[
                    ["4.2★", "App rating"],
                    ["500+", "Downloads"],
                  ].map(([v, l], i) => (
                    <motion.div
                      key={l}
                      initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.1 }}
                      className="flex-1 bg-[hsl(220_55%_12%)] px-5 py-4"
                    >
                      <div className="font-display text-2xl font-bold text-accent md:text-3xl">{v}</div>
                      <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/55">{l}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right — Device mockup */}
              <div className="relative mx-auto h-[420px] w-full max-w-xl md:h-[480px]">
                {/* halo */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-[100px]" />

                {/* Tablet back */}
                <motion.div
                  initial={{ opacity: 0, y: 30, rotate: -6 }}
                  whileInView={{ opacity: 1, y: 0, rotate: -8 }}
                  viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }}
                  className="absolute left-2 top-4 h-[280px] w-[210px] rounded-2xl border-[6px] border-white/95 bg-gradient-to-br from-white to-slate-100 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] md:h-[320px] md:w-[240px]"
                >
                  <div className="flex h-full flex-col gap-2 p-3">
                    <div className="h-2 w-12 rounded-full bg-primary/30" />
                    {Array.from({ length: 7 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ width: 0 }} whileInView={{ width: i % 2 ? "70%" : "100%" }}
                        viewport={{ once: true }} transition={{ delay: 0.6 + i * 0.06 }}
                        className="h-1.5 rounded-full bg-slate-200"
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Laptop */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 }}
                  className="absolute left-1/2 top-12 w-[380px] -translate-x-1/2 md:w-[480px]"
                >
                  <div className="rounded-t-2xl border-[8px] border-slate-900 bg-white shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
                    <div className="flex h-[230px] flex-col gap-2 p-4 md:h-[270px]">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        <span className="h-2 w-2 rounded-full bg-yellow-400" />
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        <span className="ml-3 inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                          <MessageSquare className="h-2.5 w-2.5" /> Doubt Forum
                        </span>
                      </div>
                      <div className="mt-2 grid gap-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="flex items-center gap-2 rounded-md bg-slate-50 p-2"
                          >
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary to-accent shadow" />
                            <div className="flex-1 space-y-1">
                              <div className="h-1.5 w-3/4 rounded bg-slate-300" />
                              <div className="h-1.5 w-1/2 rounded bg-slate-200" />
                            </div>
                            <div className="h-3 w-3 rounded-full bg-accent/40" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="-mx-3 h-2 rounded-b-xl bg-gradient-to-b from-slate-700 to-slate-900" />
                  <div className="mx-auto h-1.5 w-24 rounded-b-md bg-slate-800" />
                </motion.div>

                {/* Phone */}
                <motion.div
                  initial={{ opacity: 0, y: 40, rotate: 6 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 4 }}
                  viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.45 }}
                  className="absolute right-0 top-2 h-[320px] w-[160px] overflow-hidden rounded-[2rem] border-[6px] border-slate-900 bg-gradient-to-br from-white to-slate-50 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.7)] md:h-[360px] md:w-[180px]"
                >
                  <div className="absolute left-1/2 top-1.5 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-slate-900" />
                  <div className="flex h-full flex-col gap-2 p-3 pt-6">
                    <div className="h-2 w-10 rounded-full bg-accent" />
                    <div className="grid grid-cols-2 gap-1.5">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.6 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.6 + i * 0.08 }}
                          className="aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/30 shadow-inner"
                        />
                      ))}
                    </div>
                    <div className="mt-auto space-y-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-1.5 w-full rounded bg-slate-200" />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating accent badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.7 }}
                  className="absolute bottom-2 left-2 z-10"
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent-foreground shadow-[0_10px_30px_-8px_hsl(var(--accent)/0.7)]"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-foreground opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-foreground" />
                    </span>
                    Sync'd Live
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}



/* ─────────────────  COMPANIES  ───────────────── */

function CompaniesSection() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[hsl(220_60%_10%)] py-24 text-primary-foreground md:py-28">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.12),transparent_60%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-primary/40 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(hsl(var(--accent))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--accent))_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="container-px relative mx-auto max-w-7xl">
        <FadeIn>
          <div className="text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
              Where our alumni{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent">
                  go to work
                </span>
                <span aria-hidden className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-accent to-transparent" />
              </span>
              .
            </h2>
          </div>
        </FadeIn>

        {/* Dual-direction marquee */}
        <div className="mt-14 space-y-5">
          <CompaniesMarquee speed="55s" />
          <CompaniesMarquee reverse speed="45s" />
        </div>

      </div>
    </section>
  );
}

/* FAQ section now lives in @/components/site/FAQ */


/* ─────────────────  FINAL CTA  ───────────────── */

function FinalCta() {
  return (
    <section className="container-px mx-auto max-w-7xl pb-12 pt-4 md:pb-16">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-navy-gradient p-10 text-primary-foreground shadow-elevated md:p-16">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
        <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">Ready when you are</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
              Talk to a counsellor.<br />
              Walk away with a roadmap.
            </h2>
            <p className="mt-4 max-w-md text-white/75">
              A 20-minute, no-pressure call to map your goal and the fastest route there.
            </p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-accent pl-6 pr-2 py-2 text-sm font-bold uppercase tracking-[0.18em] text-accent-foreground shadow-elevated"
            >
              Book Free Guidance
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-primary transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <a
              href={`https://wa.me/${brand.whatsapp.replace(/\D/g, "")}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
