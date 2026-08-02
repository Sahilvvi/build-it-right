import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Play, Youtube, Sparkles, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { FadeIn, Counter } from "@/components/site/primitives";
import { PremiumOrbs, AmbientDark, AmbientLight, EyebrowBadge, GradientAccent } from "@/components/site/premium";
import { FAQ } from "@/components/site/FAQ";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Resources — Learn Finance with Manoj Rajgopal | Fin-Envision Learning" },
      { name: "description", content: "Free YouTube playlists on CFA® Level I & II, Financial Modelling, Stock Markets, Corporate Finance and Investment Banking — taught by Manoj Rajgopal, CFA." },
      { property: "og:title", content: "Resources — Finance Insights You Can Actually Use" },
      { property: "og:url", content: "/resources" },
    ],
    links: [{ rel: "canonical", href: "/resources" }],
  }),
  component: ResourcesPage,
});

import { resourcePlaylists } from "@/data/site";

const YT_CHANNEL = "https://www.youtube.com/@financewithmanojrajgopal";

type Category = "CFA Level I" | "CFA Level II" | "Financial Modelling" | "Stock Market" | "Banking" | "Professional";
type Video = { title: string; cat: Category; mins: number; tone: string; url: string };

const PLAYLIST_URLS: Record<string, string> = {
  "CFA Level 1 \u2013 FSA \u2013 Financial Analysis Techniques (Ratios)":
    "https://youtube.com/playlist?list=PLzfcxNTCNDhgTM6tnbGmkZt7Lznt7h7Zs",
  "CFA Level 1 \u2013 FSA | Income Statement":
    "https://youtube.com/playlist?list=PLzfcxNTCNDhit5ehwq3Scrm3PqQPV-4OZ",
  "CFA Level 1 \u2013 Quants | Time Value of Money":
    "https://youtube.com/playlist?list=PLzfcxNTCNDhhp8HrFCBUBMjr33HPrfhEI",
};

const TONE_BY_CAT: Record<Category, string[]> = {
  "CFA Level I": ["from-[#1a3a5c] to-[#2d5a8c]", "from-blue-700 to-indigo-900", "from-cyan-600 to-blue-800"],
  "CFA Level II": ["from-indigo-600 to-violet-800", "from-fuchsia-600 to-purple-800", "from-violet-700 to-purple-900"],
  "Financial Modelling": ["from-emerald-600 to-teal-800", "from-teal-500 to-emerald-700"],
  "Stock Market": ["from-amber-500 to-orange-700", "from-orange-500 to-rose-700"],
  "Banking": ["from-rose-600 to-red-800"],
  "Professional": ["from-slate-700 to-slate-900"],
};

const CAT_MAP: Record<string, Category> = {
  "CFA Level I": "CFA Level I",
  "CFA Level II": "CFA Level II",
  "Financial Modelling": "Financial Modelling",
  "Stock Market": "Stock Market",
  "Banking & Industry Analysis": "Banking",
  "Professional Finance Programs": "Professional",
};

const videos: Video[] = resourcePlaylists.flatMap((group) => {
  const cat = CAT_MAP[group.category];
  const tones = TONE_BY_CAT[cat];
  return group.playlists.map((title, i) => ({
    title,
    cat,
    mins: 20 + ((title.length * 7) % 45),
    tone: tones[i % tones.length],
    url: PLAYLIST_URLS[title] ?? YT_CHANNEL,
  }));
});

const tabs = ["All", "CFA Level I", "CFA Level II", "Financial Modelling", "Stock Market", "Banking", "Professional"] as const;

const stats = [
  { value: 20, suffix: "+", label: "Playlists" },
  { value: 6, suffix: "", label: "Categories" },
  { value: 5000, suffix: "+", label: "Students trained" },
  { value: 8, suffix: "+ yrs", label: "Of teaching" },
];

const PAGE_SIZE = 3;

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

/* Rotating conic-gradient ring — homepage signature */
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
function ResourcesPage() {
  const [active, setActive] = useState<(typeof tabs)[number]>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const base = active === "All" ? videos : videos.filter((v) => v.cat === active);
    const q = query.trim().toLowerCase();
    return q ? base.filter((v) => v.title.toLowerCase().includes(q)) : base;
  }, [active, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[hsl(220_55%_12%)] text-primary-foreground">
        <PremiumOrbs />

        <div className="container-px relative mx-auto max-w-7xl pb-24 pt-20 md:pt-28">
          <EyebrowBadge tone="dark">Resources</EyebrowBadge>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-6 max-w-5xl text-balance font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[5.5rem]"
          >
            Learn Finance with <GradientAccent>Manoj Rajgopal.</GradientAccent>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-6 max-w-2xl text-pretty text-lg text-white/75 md:text-xl"
          >
            Access our complete library of finance playlists covering CFA®, Financial Modelling, Stock Markets, Corporate Finance, Investment Banking, and more. All resources are available free on YouTube and are designed to help you learn at your own pace.
          </motion.p>

          {/* search + stats */}
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div className="group relative">
              <motion.span
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-[1.5px] rounded-full opacity-60"
                style={{
                  background:
                    "conic-gradient(from 0deg, hsl(var(--accent)/0.7), transparent 30%, hsl(var(--primary)/0.6) 60%, transparent 90%, hsl(var(--accent)/0.7))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 0)",
                }}
              />
              <Search className="pointer-events-none absolute left-5 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-white/50" />
              <input
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search resources, topics, episodes…"
                className="relative w-full rounded-full border border-white/20 bg-[hsl(220_55%_12%)] py-4 pl-14 pr-6 text-white placeholder:text-white/50 outline-none transition focus:border-accent/60"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
                  className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur transition-all hover:border-accent/40 hover:bg-white/[0.14]"
                >
                  <div className="font-display text-xl font-semibold text-white md:text-2xl">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/65">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PLAYLIST */}
      <section className="container-px mx-auto max-w-7xl -mt-12 pb-16">
        <FadeIn>
          <div className="group relative grid gap-10 overflow-hidden rounded-[2.5rem] border border-border bg-card p-8 shadow-elevated md:grid-cols-[1fr_1.4fr] md:p-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

            <div className="relative">
              {/* Rotating halo around playlist artwork */}
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 rounded-[2rem] opacity-60"
                style={{
                  background:
                    "conic-gradient(from 0deg, hsl(var(--accent)/0.6), transparent 30%, hsl(var(--primary)/0.6) 60%, transparent 90%, hsl(var(--accent)/0.6))",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
                }}
              />
              <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a3a5c] via-[#21426b] to-[#0f2a44]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.25),transparent_60%)]" />
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                />
                <div className="absolute inset-0 grid place-items-center text-white">
                  <div className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-accent text-accent-foreground shadow-glow"
                    >
                      <Play className="h-10 w-10 translate-x-0.5 fill-current" />
                    </motion.div>
                    <div className="mt-6 font-display text-3xl font-semibold italic">CFA Level I</div>
                    <div className="mt-2 text-xs uppercase tracking-[0.2em] text-white/70">Foundation series</div>
                  </div>
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">Most-watched category</span>
              </div>
            </div>

            <div className="relative">
              <EyebrowBadge>Most-watched category</EyebrowBadge>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                CFA Level I <GradientAccent>with Manoj Sir</GradientAccent>
              </h2>
              <p className="mt-5 text-pretty text-muted-foreground md:text-lg">
                Nine deep-dive playlists across Financial Statement Analysis, Quants, Economics, Equity Investments, Fixed Income and Corporate Finance — the exact concept-first approach used inside our classroom, made free on YouTube.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={YT_CHANNEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-6 py-3 text-sm font-semibold uppercase tracking-wider text-background transition-all hover:scale-[1.02] hover:shadow-elevated"
                >
                  <motion.span
                    aria-hidden
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  />
                  <Youtube className="relative h-4 w-4" />
                  <span className="relative">Check YouTube playlist</span>
                </a>
                <a href={YT_CHANNEL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold transition-all hover:scale-[1.02] hover:border-accent/40 hover:text-accent">
                  Browse all <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {["9 playlists", "Concept-first", "Free on YouTube"].map((p) => (
                  <span key={p} className="rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* CATEGORY TABS + GRID */}
      <section className="relative overflow-hidden py-24 md:py-32">
        <AmbientLight />
        <div className="container-px relative mx-auto max-w-7xl">
          <FadeIn>
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div className="flex flex-col gap-5">
                <EyebrowBadge>Library</EyebrowBadge>
                <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                  Every video. <GradientAccent>Every topic.</GradientAccent>
                </h2>
              </div>
              <div className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-card">
                <span className="font-display text-base font-semibold text-foreground">{filtered.length}</span> resources
              </div>
            </div>
          </FadeIn>

          {/* Tabs with sliding pill */}
          <div className="mt-10 inline-flex flex-wrap gap-1 rounded-full border border-border bg-card p-1.5 shadow-card">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => { setActive(t); setPage(1); }}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors",
                  active === t ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active === t && (
                  <motion.span
                    layoutId="resources-tab"
                    className="absolute inset-0 rounded-full bg-foreground shadow-glow"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {pageItems.map((v, i) => (
                <motion.a
                  href={v.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    // Fallback for in-app / mobile browsers that block target=_blank
                    const w = window.open(v.url, "_blank", "noopener,noreferrer");
                    if (!w) window.location.href = v.url;
                    e.preventDefault();
                  }}
                  key={v.title}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: (i % 9) * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative block cursor-pointer touch-manipulation overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all hover-lift"
                >
                  <div className={cn("pointer-events-none relative aspect-video overflow-hidden bg-gradient-to-br", v.tone)}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_55%,rgba(0,0,0,0.6))]" />
                    {/* shimmer sweep on hover */}
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      animate={{ x: ["0%", "400%"] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
                    />

                    <div className="pointer-events-none absolute inset-0 grid place-items-center">
                      <div className="relative grid h-16 w-16 place-items-center">
                        <ConicRing size="h-16 w-16" />
                        <div className="relative grid h-14 w-14 place-items-center rounded-full bg-white/95 text-foreground shadow-elevated transition-transform duration-300 group-hover:scale-110">
                          <Play className="h-6 w-6 translate-x-0.5 fill-current" />
                        </div>
                      </div>
                    </div>

                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      <Clock className="h-3 w-3" /> {v.mins} min
                    </span>
                    <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-foreground">
                      {v.cat}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug transition-colors group-hover:text-primary">
                      {v.title}
                    </h3>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      Watch now <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <div className="mt-16 rounded-3xl border border-dashed border-border bg-card/50 p-12 text-center text-muted-foreground">
              No resources match your search. Try a different keyword.
            </div>
          )}

          {/* Pagination */}
          {filtered.length > PAGE_SIZE && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition disabled:opacity-40 hover:enabled:border-accent/50 hover:enabled:text-accent"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={cn(
                    "relative h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition",
                    page === i + 1
                      ? "text-primary-foreground"
                      : "border border-border bg-card text-muted-foreground hover:border-accent/40 hover:text-foreground"
                  )}
                >
                  {page === i + 1 && (
                    <motion.span
                      layoutId="page-pill"
                      className="absolute inset-0 rounded-full bg-foreground shadow"
                      transition={{ type: "spring", duration: 0.4 }}
                    />
                  )}
                  <span className="relative">{String(i + 1).padStart(2, "0")}</span>
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-muted-foreground transition disabled:opacity-40 hover:enabled:border-accent/50 hover:enabled:text-accent"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SUBSCRIBE STRIP */}
      <section className="container-px mx-auto max-w-7xl pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-navy-gradient p-10 text-primary-foreground md:p-16">
          <AmbientDark />
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <EyebrowBadge tone="dark">Stay sharp</EyebrowBadge>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                One new explainer. <GradientAccent>Every Sunday.</GradientAccent>
              </h2>
              <p className="mt-5 max-w-xl text-white/75 md:text-lg">
                Curated drops, CFA tactics and career playbooks — straight to your inbox. No spam, ever.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="flex-1 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-white placeholder:text-white/50 backdrop-blur outline-none transition focus:border-accent/60 focus:bg-white/15"
                />
                <button className="group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-transform hover:scale-[1.02]">
                  <motion.span
                    aria-hidden
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  />
                  <span className="relative">Subscribe</span>
                  <ArrowRight className="relative h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </form>
            </div>

            <div className="relative mx-auto grid aspect-square w-full max-w-xs place-items-center">
              <motion.div
                aria-hidden
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-4 rounded-[2.5rem] opacity-60"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, hsl(var(--accent)/0.5) 80deg, transparent 160deg, hsl(var(--primary)/0.5) 240deg, transparent 320deg)",
                  mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
                  WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
                }}
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative grid h-full w-full place-items-center rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur"
              >
                <div className="text-center text-white">
                  <Youtube className="mx-auto h-16 w-16 text-accent" />
                  <div className="mt-4 font-display text-3xl font-semibold">@FinEnvision</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/70">Subscribe on YouTube</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        eyebrow="FAQ"
        title={<>More about our <span className="italic bg-gradient-to-r from-accent via-accent to-accent/60 bg-clip-text text-transparent">resources.</span></>}
        description="Common questions about our YouTube library, newsletter and how to use them in your CFA / FRM prep."
      />

    </SiteLayout>
  );
}
