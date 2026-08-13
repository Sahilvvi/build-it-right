import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { FadeIn } from "@/components/site/primitives";
import { AmbientLight, EyebrowBadge, GradientAccent } from "@/components/site/premium";
import { cn } from "@/lib/utils";
import { resourcePlaylists } from "@/data/site";

const YT_CHANNEL = "https://www.youtube.com/@financewithmanojrajgopal";

type Category = "CFA® Level I" | "CFA® Level II" | "Financial Modelling" | "Stock Market" | "Banking" | "Professional";
type Video = { title: string; cat: Category; mins: number; tone: string; url: string; thumb?: string };

const PLAYLIST_URLS: Record<string, string> = {
  "CFA® Level 1 – FSA – Financial Analysis Techniques (Ratios)":
    "https://youtube.com/playlist?list=PLzfcxNTCNDhgTM6tnbGmkZt7Lznt7h7Zs",
  "CFA® Level 1 – FSA | Income Statement":
    "https://youtube.com/playlist?list=PLzfcxNTCNDhit5ehwq3Scrm3PqQPV-4OZ",
  "CFA® Level 1 – Quants | Time Value of Money":
    "https://youtube.com/playlist?list=PLzfcxNTCNDhhp8HrFCBUBMjr33HPrfhEI",
  "CFA® Level 2 Pre-Requisite":
    "https://www.youtube.com/watch?v=x3ydYkq4nZY&list=PLzfcxNTCNDhjDNbeQZ2hLcQK4ygnnLpAJ",
  "CFA® Level 2 – FSA | Intercorporate Investments":
    "https://www.youtube.com/watch?v=JPc8B8G9SsM&list=PLzfcxNTCNDhjfE80oevHDImEYa6Ztq5oP",
  "CFA® Level 2 – Derivatives | Contingent Claims":
    "https://www.youtube.com/watch?v=1Y05GmsoqKs&list=PLzfcxNTCNDhj9H5qy28MAHT-OQXGDNk6S",
  "CFA® Level 2 – Equity | Private Company Valuation":
    "https://www.youtube.com/watch?v=XeQQywq8uog&list=PLzfcxNTCNDhhUot2hQahID8XxAzfXuWET",
  "CFA® Level 2 – Alternative Investments | Investments in Real Estate":
    "https://www.youtube.com/watch?v=MzoBmDX1rf4&list=PLzfcxNTCNDhghWKcGlpWXiza3YPmOzFfB",
  "Financial Modeling Demo Sessions":
    "https://www.youtube.com/watch?v=L-VIKPHW0RU&list=PLzfcxNTCNDhjk0wLR_zEIQ_2OBcE8Rfd2",
  "Company Analysis":
    "https://www.youtube.com/watch?v=TtHxD0FssMY&list=PLzfcxNTCNDhiOdTpzGD3eGUmR5YfbHY9i",
  "Basics of Stock Market":
    "https://www.youtube.com/watch?v=crFZ_-R5ID0&list=PLzfcxNTCNDhjAhY8Id6Pwa64sYmH0srgM",
  "Watch List Vs Warn List":
    "https://www.youtube.com/watch?v=YLJnHgC6-a0&list=PLzfcxNTCNDhgWhTANBQYySR0ajgjcEP3y",
  "Banking Series":
    "https://www.youtube.com/watch?v=HC1nUT961CU&list=PLzfcxNTCNDhgTce59yBtGT2ZCz1pLtWAg",
};

const PLAYLIST_THUMBS: Record<string, string> = {
  "CFA® Level 1 – FSA – Financial Analysis Techniques (Ratios)":
    "https://i.ytimg.com/vi/bdlLEeYEs5Q/hqdefault.jpg",
  "CFA® Level 1 – FSA | Income Statement":
    "https://i.ytimg.com/vi/db7v1Jli2j8/hqdefault.jpg",
  "CFA® Level 1 – Quants | Time Value of Money":
    "https://i.ytimg.com/vi/oKhc21rQpuU/hqdefault.jpg",
  "CFA® Level 2 Pre-Requisite":
    "https://i.ytimg.com/vi/x3ydYkq4nZY/hqdefault.jpg",
  "CFA® Level 2 – FSA | Intercorporate Investments":
    "https://i.ytimg.com/vi/JPc8B8G9SsM/hqdefault.jpg",
  "CFA® Level 2 – Derivatives | Contingent Claims":
    "https://i.ytimg.com/vi/1Y05GmsoqKs/hqdefault.jpg",
  "CFA® Level 2 – Equity | Private Company Valuation":
    "https://i.ytimg.com/vi/XeQQywq8uog/hqdefault.jpg",
  "CFA® Level 2 – Alternative Investments | Investments in Real Estate":
    "https://i.ytimg.com/vi/MzoBmDX1rf4/hqdefault.jpg",
  "Financial Modeling Demo Sessions":
    "https://i.ytimg.com/vi/L-VIKPHW0RU/hqdefault.jpg",
  "Company Analysis":
    "https://i.ytimg.com/vi/TtHxD0FssMY/hqdefault.jpg",
  "Basics of Stock Market":
    "https://i.ytimg.com/vi/crFZ_-R5ID0/hqdefault.jpg",
  "Watch List Vs Warn List":
    "https://i.ytimg.com/vi/YLJnHgC6-a0/hqdefault.jpg",
  "Banking Series":
    "https://i.ytimg.com/vi/HC1nUT961CU/hqdefault.jpg",
};

const TONE_BY_CAT: Record<Category, string[]> = {
  "CFA® Level I": ["from-[#1a3a5c] to-[#2d5a8c]", "from-blue-700 to-indigo-900", "from-cyan-600 to-blue-800"],
  "CFA® Level II": ["from-indigo-600 to-violet-800", "from-fuchsia-600 to-purple-800", "from-violet-700 to-purple-900"],
  "Financial Modelling": ["from-emerald-600 to-teal-800", "from-teal-500 to-emerald-700"],
  "Stock Market": ["from-amber-500 to-orange-700", "from-orange-500 to-rose-700"],
  "Banking": ["from-rose-600 to-red-800"],
  "Professional": ["from-slate-700 to-slate-900"],
};

const CAT_MAP: Record<string, Category> = {
  "CFA® Level I": "CFA® Level I",
  "CFA® Level II": "CFA® Level II",
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
    thumb: PLAYLIST_THUMBS[title],
  }));
});

const tabs = ["All", "CFA® Level I", "CFA® Level II", "Financial Modelling", "Stock Market", "Banking", "Professional"] as const;
const PAGE_SIZE = 3;

export function DemoVideos() {
  const [active, setActive] = useState<(typeof tabs)[number]>("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return videos.filter((v) => active === "All" || v.cat === active);
  }, [active]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-background border-t border-border/20">
      <AmbientLight />
      <div className="container-px relative mx-auto max-w-7xl">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="flex flex-col gap-5">
              <EyebrowBadge>Library</EyebrowBadge>
              <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
                Demo Videos. <GradientAccent>Every topic.</GradientAccent>
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
                  layoutId="demo-videos-tab"
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
                className="group relative block cursor-pointer touch-manipulation overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-all hover-lift hover:border-accent/40 hover:shadow-glow"
              >
                <div className={cn("pointer-events-none relative aspect-video overflow-hidden bg-gradient-to-br", v.tone)}>
                  {v.thumb && (
                    <img
                      src={v.thumb}
                      alt={`${v.title} — YouTube playlist thumbnail`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:brightness-110 group-hover:contrast-105"
                    />
                  )}
                  {!v.thumb && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)] transition-opacity duration-300 group-hover:opacity-80" />
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_60%,rgba(0,0,0,0.55))] transition-opacity duration-300 group-hover:opacity-80" />

                  {/* minimal YouTube icon — only on hover, no circle/ring */}
                  <div className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                      Watch on YouTube
                    </div>
                  </div>

                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur transition-colors duration-300 group-hover:bg-black/85">
                    <Clock className="h-3 w-3" /> {v.mins} min
                  </span>
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/95 backdrop-blur transition-all duration-300 group-hover:bg-accent group-hover:text-accent-foreground group-hover:shadow-glow">
                    {v.cat}
                  </span>
                </div>

                <div className="p-5 transition-colors duration-300 group-hover:bg-accent/[0.03]">
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
            No resources match.
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
                    layoutId="demo-videos-page-pill"
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
  );
}
