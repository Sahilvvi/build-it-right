import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

import { ArrowRight, Linkedin, Mail, Sparkles, Users, Target, Compass, Phone, Quote } from "lucide-react";
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

type TeamMember = { name: string; role: string; cat: "Leadership" | "Communications" | "Success" | "Content" | "Career"; lead?: boolean; tone: string };

const team: TeamMember[] = [
  { name: "Manoj Rajgopal, CFA", role: "Founder & Lead Instructor", cat: "Leadership", tone: "from-[#1a3a5c] to-[#2d5a8c]" },
  { name: "Senior Faculty", role: "CFA Charterholder · Equity Research", cat: "Leadership", tone: "from-slate-700 to-slate-900" },
  { name: "Modeling Faculty", role: "Financial Modeling Instructor", cat: "Leadership", tone: "from-indigo-700 to-violet-800" },
  { name: "Admissions Team", role: "Candidate Counselling", cat: "Communications", lead: true, tone: "from-amber-500 to-orange-600" },
  { name: "Course Advisor", role: "Course Counsellor — CFA", cat: "Communications", tone: "from-rose-500 to-pink-700" },
  { name: "Batch Coordinator", role: "Batch & Schedule Coordinator", cat: "Communications", tone: "from-emerald-500 to-teal-700" },
  { name: "Support Desk", role: "Student Support Associate", cat: "Communications", tone: "from-cyan-600 to-blue-800" },
  { name: "Doubt Clinic Lead", role: "Doubt-Solving Mentor", cat: "Success", lead: true, tone: "from-[#0f2a44] to-[#1e4976]" },
  { name: "Mock Test Lead", role: "Assessments & Mocks", cat: "Success", tone: "from-rose-600 to-red-800" },
  { name: "Mentor — L1", role: "CFA Level 1 Mentor", cat: "Success", tone: "from-teal-500 to-emerald-700" },
  { name: "Mentor — L2", role: "CFA Level 2 Mentor", cat: "Success", tone: "from-orange-500 to-rose-700" },
  { name: "Career Mentor", role: "Career Guidance Lead", cat: "Career", lead: true, tone: "from-amber-500 to-orange-700" },
  { name: "Placement Liaison", role: "Industry Partnerships", cat: "Career", tone: "from-slate-600 to-slate-900" },
  { name: "Notes Editor", role: "Handwritten Notes Lead", cat: "Content", lead: true, tone: "from-pink-500 to-rose-700" },
  { name: "Video Editor", role: "Lecture Production", cat: "Content", tone: "from-indigo-600 to-blue-900" },
  { name: "QBank Author", role: "Question Bank Author", cat: "Content", tone: "from-emerald-600 to-teal-800" },
];



const heroStats = [
  { value: 5000, suffix: "+", label: "Students trained" },
  { value: 90, suffix: "%", label: "Success rate" },
  { value: 109, suffix: "", label: "Google reviews" },
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

      {/* MEET THE CREW — dark stage like homepage */}
      <section className="relative overflow-hidden bg-[hsl(220_50%_9%)] py-24 text-primary-foreground md:py-32">
        <AmbientDark />
        <div className="container-px relative mx-auto max-w-7xl">
          <PremiumHeader
            tone="dark"
            eyebrow="The Crew"
            title={<>Meet your <GradientAccent>Fin-Envision</GradientAccent> crew.</>}
            description="We've built a ground team dedicated to one mission — your success. Think of us as your backstage support system, making sure you shine on stage."
          />

          <motion.div layout className="mt-12 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {team.filter((m) => m.cat === "Leadership").map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-md transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.08]"
              >
                <div className={cn("relative aspect-[4/5] overflow-hidden bg-gradient-to-br", m.tone)}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_60%)]" />
                  <div className="absolute inset-0 bg-[linear-gradient(transparent_55%,rgba(0,0,0,0.7))]" />
                  <div className="absolute inset-0 grid place-items-center font-display text-6xl font-bold text-white/90 transition-transform duration-500 group-hover:scale-110">
                    {m.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  {m.lead && (
                    <span className="absolute left-4 top-4 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-foreground shadow">
                      Team Lead
                    </span>
                  )}
                  <a href="#" aria-label="LinkedIn" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 hover:bg-white/25">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
                <div className="p-5">
                  <div className="font-display text-base font-semibold text-white">{m.name}</div>
                  <div className="mt-1 text-xs text-white/60">{m.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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

      {/* LEARNERS TO LEADERS CTA */}
      <section className="container-px mx-auto max-w-7xl pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[hsl(220_60%_9%)] p-[1.5px]">
          {/* rotating conic frame */}
          <motion.span
            aria-hidden
            className="absolute inset-[-40%] opacity-80"
            style={{
              background:
                "conic-gradient(from 0deg, hsl(var(--accent)/0.6), transparent 25%, hsl(var(--primary)/0.8) 50%, transparent 75%, hsl(var(--accent)/0.6))",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative overflow-hidden rounded-[calc(2.5rem-1.5px)] bg-[hsl(220_55%_10%)] p-10 text-primary-foreground md:p-16">
            <AmbientDark />
            {/* mesh blobs */}
            <motion.div
              aria-hidden
              animate={{ x: [0, 24, 0], y: [0, -18, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/25 blur-3xl"
            />
            <motion.div
              aria-hidden
              animate={{ x: [0, -20, 0], y: [0, 22, 0] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-primary/40 blur-3xl"
            />
            {/* dot grid mask */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: "radial-gradient(white 1px, transparent 1px)",
                backgroundSize: "26px 26px",
                maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
              }}
            />

            <div className="relative grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <EyebrowBadge tone="dark">Learn it. Prove it. Own it.</EyebrowBadge>
                <motion.h2
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className="mt-5 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl"
                >
                  From learners to leaders — <GradientAccent>you're next.</GradientAccent>
                </motion.h2>
                <p className="mt-5 max-w-xl text-pretty text-white/70 md:text-lg">
                  Turn your learning into leadership. With Fin-Envision's guidance, every step takes you closer to your dream role in finance.
                </p>

                {/* mini proof strip */}
                <div className="mt-7 grid max-w-md grid-cols-3 gap-4 border-y border-white/10 py-5">
                  {[
                    { v: 94, s: "%", l: "Placement" },
                    { v: 130, s: "+", l: "Hiring partners" },
                    { v: 24, s: "h", l: "Avg reply" },
                  ].map((x) => (
                    <div key={x.l}>
                      <div className="font-display text-2xl font-bold text-white md:text-3xl">
                        <Counter to={x.v} suffix={x.s} />
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/55">{x.l}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    to="/contact"
                    className="group/btn relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
                  >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
                    Career Services
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                  <Link
                    to="/courses"
                    className="group/btn inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur transition-colors hover:bg-white/10"
                  >
                    Browse programmes
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto grid aspect-square w-full max-w-sm place-items-center">
                {/* outer rotating ring */}
                <motion.div
                  aria-hidden
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-6 rounded-[2.75rem] opacity-80"
                  style={{
                    background:
                      "conic-gradient(from 0deg, transparent 0deg, hsl(var(--accent)/0.7) 80deg, transparent 160deg, hsl(var(--primary)/0.7) 240deg, transparent 320deg)",
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
                    WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 0)",
                  }}
                />
                {/* inner counter-rotating dashed ring */}
                <motion.div
                  aria-hidden
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 rounded-[2.25rem] border border-dashed border-white/15"
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative grid h-full w-full place-items-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-primary/90 to-primary/60 text-primary-foreground shadow-elevated"
                >
                  {/* shimmer sweep */}
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(closest-side,white_0%,transparent_70%)] opacity-10" />
                  <div className="relative text-center">
                    <div className="font-display text-7xl font-bold leading-none md:text-8xl">
                      <Counter to={27} />k+
                    </div>
                    <div className="mt-3 text-xs uppercase tracking-[0.22em] opacity-85">Learners placed</div>
                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur">
                      <Sparkles className="h-3 w-3" /> across 50+ countries
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="absolute -right-4 -top-4 rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-elevated"
                  >
                    <div className="font-display text-xs uppercase tracking-[0.18em] text-accent">94%</div>
                    <div className="font-semibold text-foreground">placement rate</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="absolute -bottom-4 -left-4 -rotate-6 rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-elevated"
                  >
                    <div className="font-display text-xs uppercase tracking-[0.18em] text-accent">4.9★</div>
                    <div className="font-semibold text-foreground">learner rating</div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN US / PARTNER */}
      <section className="relative overflow-hidden bg-[hsl(220_55%_10%)] py-24 text-primary-foreground">
        <AmbientDark />
        <div className="container-px relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <EyebrowBadge tone="dark">Let's build together</EyebrowBadge>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="mt-5 text-balance font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              Work with us, <GradientAccent>or hire from us.</GradientAccent>
            </motion.h2>
            <p className="mt-5 text-pretty text-white/70 md:text-lg">
              Two doors. Same mission — make finance click for the next generation of analysts, traders, and CFOs.
            </p>
          </div>

          <Stagger className="mt-14 grid gap-6 lg:grid-cols-2">
            {[
              {
                t: "Our team is thriving!",
                b: 'Work with people who love turning "I don\'t get it" into "Got it." Help us grow the learner community.',
                cta: "inquire@lumenedge.com",
                href: "mailto:inquire@lumenedge.com",
                icon: Mail,
                kicker: "Careers · Mentor roles · Internships",
                stats: [
                  { v: "40+", l: "Team members" },
                  { v: "4.9★", l: "Glassdoor" },
                  { v: "100%", l: "Remote-friendly" },
                ],
                tag: "We're hiring",
              },
              {
                t: "Join hands with us",
                b: "Corporate Training · Hire From Us · University Partnership — let's design a programme that fits your team.",
                cta: "+91 88887 33330",
                href: "tel:+918888733330",
                icon: Phone,
                kicker: "Partnerships · Hiring · L&D",
                stats: [
                  { v: "130+", l: "Hiring partners" },
                  { v: "27k+", l: "Talent pool" },
                  { v: "≤ 1h", l: "Reply time" },
                ],
                tag: "Talk to partnerships",
              },
            ].map((c) => (
              <StaggerItem key={c.t} variants={staggerItemVariants}>
                <motion.a
                  href={c.href}
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="group relative block overflow-hidden rounded-[2rem] p-[1.5px]"
                >
                  {/* rotating conic border */}
                  <motion.span
                    aria-hidden
                    className="absolute inset-[-40%] opacity-70"
                    style={{
                      background:
                        "conic-gradient(from 0deg, hsl(var(--accent)/0.55), transparent 30%, hsl(var(--primary)/0.7) 55%, transparent 80%, hsl(var(--accent)/0.55))",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="relative overflow-hidden rounded-[calc(2rem-1.5px)] bg-[hsl(220_55%_11%)] p-10">
                    {/* decorative mesh */}
                    <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/15 blur-3xl transition-opacity duration-500 group-hover:opacity-90" />
                    <div className="pointer-events-none absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-primary/30 blur-3xl opacity-50" />
                    {/* shimmer sweep */}
                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="relative grid h-14 w-14 place-items-center">
                        <motion.span
                          aria-hidden
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "conic-gradient(from 0deg, hsl(var(--accent)), transparent 60%, hsl(var(--accent)))",
                          }}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        />
                        <div className="relative grid h-12 w-12 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow">
                          <c.icon className="h-5 w-5" />
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                        </span>
                        {c.tag}
                      </span>
                    </div>

                    <div className="relative mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-white/55">
                      {c.kicker}
                    </div>
                    <div className="relative mt-2 font-display text-3xl font-semibold text-white md:text-4xl">{c.t}</div>
                    <p className="relative mt-3 text-white/70">{c.b}</p>

                    <div className="relative mt-7 grid grid-cols-3 gap-3 border-y border-white/10 py-5">
                      {c.stats.map((s) => (
                        <div key={s.l}>
                          <div className="font-display text-2xl font-bold text-white">{s.v}</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/50">{s.l}</div>
                        </div>
                      ))}
                    </div>

                    <div className="relative mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform group-hover:-translate-y-0.5">
                      {c.cta}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </motion.a>
              </StaggerItem>
            ))}
          </Stagger>
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
