import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { ArrowRight, Users, Target, Compass, Quote } from "lucide-react";
import { SiteLayout } from "@/components/site/Layout";
import { FadeIn, Stagger, StaggerItem, staggerItemVariants, Counter } from "@/components/site/primitives";
import { PremiumOrbs, AmbientDark, AmbientLight, EyebrowBadge, GradientAccent } from "@/components/site/premium";
import { FAQ } from "@/components/site/FAQ";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Learn Finance the Way the Industry Works | Fin-Envision Learning" },
      { name: "description", content: "Fin-Envision offers certified programs in CFA® and Financial Modelling — 5,000+ students trained, 80–90% success rate, 8+ years of teaching experience, led by Manoj Rajgopal, CFA." },
      { property: "og:title", content: "About — Learn Finance the Way the Industry Works" },
      { property: "og:description", content: "We don't just teach finance — we transform how you learn it." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

// ─────────────────────────────── data ───────────────────────────────
const gallery = [
  { tone: "from-[#1a3a5c] to-[#2d5a8c]", label: "Pune HQ" },
  { tone: "from-amber-500 to-orange-600", label: "Cohort '24" },
  { tone: "from-slate-700 to-slate-900", label: "Bengaluru" },
  { tone: "from-rose-500 to-pink-700", label: "Mock Exam Day" },
  { tone: "from-emerald-500 to-teal-700", label: "Mentor Meet" },
  { tone: "from-indigo-600 to-violet-800", label: "Mumbai Hub" },
  { tone: "from-[#0f2a44] to-[#1e4976]", label: "Career Fair" },
  { tone: "from-amber-400 to-amber-700", label: "Graduation" },
  { tone: "from-cyan-600 to-blue-800", label: "Workshop" },
];

const leadership = {
  name: "Manoj Rajgopal, CFA",
  initials: "MR",
  role: "Founder & Lead Instructor",
  quote: "My ability to creatively simplify complicated concepts comes from genuinely caring about each student's journey — concept clarity always beats rote learning.",
  work: [
    "Founder and Lead Instructor of Fin-Envision Learning.",
    "Cleared all three levels of the CFA® Program in the first attempt.",
    "Worked with reputed organizations such as CRISIL and JHP, gaining valuable industry exposure.",
    "Has successfully trained over 5,000 students across Mumbai.",
    "Known for simplifying complex financial concepts into easy-to-understand, practical lessons.",
    "Focuses on bridging the gap between academic learning and real-world finance.",
    "Dedicated to mentoring students for successful careers in finance through industry-oriented training and personalized guidance.",
  ],
  creds: ["CFA Charterholder", "Investment Banking", "Financial Modeling", "Portfolio Strategy"],
};




const heroStats = [
  { value: 5000, suffix: "+", label: "Students trained" },
  { value: 90, suffix: "%", label: "Success rate" },
  { value: 216, suffix: "", label: "Google reviews" },
  { value: 8, suffix: "+ yrs", label: "Teaching experience" },
];

/* Premium section heading — homepage signature with ping-dot eyebrow */
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

/* Conic-gradient rotating ring — homepage signature */
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
function AboutPage() {


  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[hsl(220_55%_12%)] text-primary-foreground">
        <PremiumOrbs />

        <div className="container-px relative mx-auto max-w-7xl pb-24 pt-20 md:pt-28">
          <EyebrowBadge tone="dark">About Fin-Envision Learning</EyebrowBadge>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-6 max-w-5xl text-balance font-display text-5xl font-semibold leading-[1.02] tracking-tight md:text-7xl lg:text-[5.5rem]"
          >
            Learn Finance the <GradientAccent>Way</GradientAccent> the Industry Works.
          </motion.h1>

          <div className="mt-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <FadeIn>
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-accent">Who we are</div>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-white/85 md:text-xl">
                Fin-Envision is a leading training institute offering certified programs in Financial Modelling and CFA. As the name suggests, <span className="text-white">"Financial Envision"</span> is about giving a future perspective to your career — helping individuals realize their potential through mentoring and imparting skills.
              </p>
              <p className="mt-5 text-pretty text-base text-white/70 md:text-lg">
                Formulated through years of teaching experience, our coaching methodology places utmost emphasis on problem solving and conceptual clarity. Every instructor is carefully selected for their blend of expertise and passion for teaching — the human touch and care for each candidate is the real hallmark of Fin-Envision.
              </p>
            </FadeIn>

            <Stagger className="grid grid-cols-2 gap-3">
              {heroStats.map((s) => (
                <StaggerItem key={s.label} variants={staggerItemVariants}>
                  <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md transition-all hover:border-accent/40 hover:bg-white/[0.14]">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/30 opacity-0 blur-3xl transition-opacity duration-500 hover:opacity-100" />
                    <div className="font-display text-4xl font-semibold text-white md:text-5xl">
                      <Counter to={s.value} suffix={s.suffix} />
                    </div>
                    <div className="mt-2 text-xs uppercase tracking-[0.18em] text-white/65">{s.label}</div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* MISSION · VISION · VALUES */}
      <section className="relative -mt-12 pb-24 md:pb-32">
        <FadeIn className="container-px mx-auto max-w-7xl">
          <div className="flex flex-col gap-4">
            <EyebrowBadge>Inside Fin-Envision</EyebrowBadge>
            <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
              What we <GradientAccent>stand for.</GradientAccent>
            </h2>
          </div>
        </FadeIn>

        <div className="container-px mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-3">
          {[
            {
              label: "Our Mission",
              tone: "from-[#1a3a5c] to-[#2d5a8c]",
              body: "To simplify finance education and equip every learner with practical skills required for successful careers in global finance.",
            },
            {
              label: "Our Vision",
              tone: "from-indigo-700 to-violet-800",
              body: "To become the most trusted finance learning platform by making quality education accessible, practical, and career-oriented.",
            },
            {
              label: "Our Values",
              tone: "from-amber-500 to-orange-600",
              values: [
                "Practical Learning",
                "Student First",
                "Industry Relevance",
                "Continuous Mentorship",
                "Excellence Through Consistency",
              ],
            },
          ].map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-elevated transition-all hover:-translate-y-1 hover:border-accent/40"
            >
              <div className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", card.tone)} />
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-accent">{card.label}</div>
              {card.body && (
                <p className="mt-5 text-pretty text-lg leading-relaxed text-foreground/80">{card.body}</p>
              )}
              {card.values && (
                <ul className="mt-5 space-y-3">
                  {card.values.map((v) => (
                    <li key={v} className="flex items-center gap-3 text-base text-foreground/85">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {v}
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </section>


      {/* FOUNDER SPOTLIGHT */}
      <section className="relative overflow-hidden bg-background py-24 md:py-32">
        <AmbientLight />
        <div className="container-px relative mx-auto max-w-7xl">
          <PremiumHeader
            eyebrow="Lead Instructor"
            title={<>At the helm of <GradientAccent>Fin-Envision.</GradientAccent></>}
          />

          <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-start">
            <FadeIn>
              <div className="relative">
                {/* Rotating conic ring around founder portrait */}
                <motion.div
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-3 rounded-[2.75rem] opacity-50"
                  style={{
                    background:
                      "conic-gradient(from 0deg, hsl(var(--accent)/0.6), transparent 30%, hsl(var(--primary)/0.6) 60%, transparent 90%, hsl(var(--accent)/0.6))",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
                    WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
                  }}
                />
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#1a3a5c] via-[#21426b] to-[#0f2a44] shadow-elevated">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
                  <div className="grid h-full w-full place-items-center text-white">
                    <div className="text-center">
                      <div className="mx-auto grid h-40 w-40 place-items-center rounded-full bg-white/15 font-display text-6xl font-bold backdrop-blur">
                        {leadership.initials}
                      </div>
                      <div className="mt-6 font-display text-3xl font-semibold">{leadership.name}</div>
                      <div className="mt-1 text-sm uppercase tracking-[0.2em] text-white/70">Founder</div>
                    </div>
                  </div>
                </div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-border bg-card p-5 shadow-elevated md:block">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">8+ years</div>
                  <div className="font-display text-lg font-semibold">Finance · Markets · Teaching</div>
                </motion.div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <Quote className="h-10 w-10 text-accent" />
              <p className="mt-4 text-pretty text-xl italic leading-relaxed text-foreground/85 md:text-2xl">
                "{leadership.quote}"
              </p>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Manoj Sir's Journey</div>
                  <ul className="mt-4 space-y-3">
                    {leadership.work.map((w, i) => (
                      <motion.li
                        key={w}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className="flex gap-3 text-sm text-muted-foreground"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-accent to-primary" />
                        {w}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.24em] text-accent">Academic Credentials</div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {leadership.creds.map((c, i) => (
                      <motion.span
                        key={c}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium shadow-card transition-all hover:border-accent/50 hover:text-accent"
                      >
                        {c}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* LEADERSHIP PILLARS */}
      <section className="container-px mx-auto max-w-7xl py-24 md:py-32">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-navy-gradient p-10 text-primary-foreground md:p-16">
          <AmbientDark />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <FadeIn>
              <EyebrowBadge tone="dark">Leadership</EyebrowBadge>
              <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Driven by <GradientAccent>purpose.</GradientAccent>
              </h2>
              <p className="mt-5 text-white/75 md:text-lg">
                Our leadership brings deep expertise in finance and education — shaping a mission focused on student success.
              </p>
            </FadeIn>

            <Stagger className="grid gap-4">
              {[
                { icon: Target, t: "Driven by purpose", b: "Deep expertise in finance and education, shaping a mission focused on student success." },
                { icon: Compass, t: "Vision in action", b: "We listen to your goals and recommend the course that truly fits — no fluff, no hard sell." },
                { icon: Users, t: "Active involvement", b: "They mentor teams, interact with students, and stay engaged in daily progress — while keeping the long-term vision in focus." },
              ].map((x) => (
                <StaggerItem key={x.t} variants={staggerItemVariants}>
                  <div className="group flex gap-5 rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/10">
                    <div className="relative grid h-14 w-14 shrink-0 place-items-center">
                      <ConicRing size="h-14 w-14" />
                      <div className="relative grid h-12 w-12 place-items-center rounded-full bg-accent text-accent-foreground shadow-glow">
                        <x.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div>
                      <div className="font-display text-lg font-semibold text-white">{x.t}</div>
                      <div className="mt-1 text-sm text-white/70">{x.b}</div>
                    </div>
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
        title={<>More about <span className="italic bg-gradient-to-r from-accent via-accent to-accent/60 bg-clip-text text-transparent">us.</span></>}
        description="Frequently asked questions about Fin-Envision, our teaching style, and how we support every learner."
      />

    </SiteLayout>
  );
}
