import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageSquare } from "lucide-react";
import { faqs as defaultFaqs } from "@/data/site";
import { FadeIn } from "@/components/site/primitives";
import { cn } from "@/lib/utils";

type FaqItem = { q: string; a: string };

export function FAQ({
  items = defaultFaqs,
  eyebrow = "Questions, answered",
  title,
  description = "Everything you wanted to know — from materials to mentorship to fees. Tap a question to expand.",
  contactLabel = "Still have a question?",
  contactSubtitle = "Avg reply in 4 hours",
  ctaLabel = "Talk to a counsellor",
  ctaHref = "/contact",
}: {
  items?: FaqItem[];
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  contactLabel?: string;
  contactSubtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  const heading = title ?? (
    <>
      Frequently<br />
      <span className="italic bg-gradient-to-r from-accent via-accent to-accent/60 bg-clip-text text-transparent">
        asked
      </span>
      <span className="text-accent">.</span>
    </>
  );

  return (
    <section className="relative overflow-hidden bg-[hsl(220_55%_9%)] py-24 text-primary-foreground md:py-32">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--accent)/0.12),transparent_55%)]" />
      <div className="pointer-events-none absolute -left-32 top-1/3 h-[460px] w-[460px] rounded-full bg-accent/12 blur-[130px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[460px] w-[460px] rounded-full bg-primary/40 blur-[140px]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--accent)) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
        }}
      />

      <div className="container-px relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* ── Left sticky intro ── */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <FadeIn>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-accent backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                {eyebrow}
              </span>
              <h2 className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-[4.25rem]">
                {heading}
              </h2>
              <p className="mt-5 max-w-md text-base text-white/65">{description}</p>

              {/* Contact card */}
              <div className="mt-8 overflow-hidden rounded-2xl p-px">
                <div className="bg-gradient-to-br from-accent/40 via-white/10 to-primary/40 p-px rounded-2xl">
                  <div className="rounded-2xl bg-[hsl(220_55%_11%)] p-6">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent/70 text-accent-foreground shadow-[0_8px_24px_-6px_hsl(var(--accent)/0.7)]">
                        <MessageSquare className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="font-display text-base font-semibold text-white">{contactLabel}</div>
                        <div className="text-[11px] uppercase tracking-wider text-white/50">{contactSubtitle}</div>
                      </div>
                    </div>
                    <Link
                      to={ctaHref}
                      className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/[0.06] px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-accent hover:text-accent-foreground"
                    >
                      {ctaLabel}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* ── Right: numbered FAQ list ── */}
          <div className="relative">
            <div
              className="absolute left-[26px] top-2 bottom-2 w-px bg-gradient-to-b from-transparent via-white/12 to-transparent"
              aria-hidden
            />

            <ul className="space-y-4">
              {items.map((f, i) => {
                const isOpen = open === i;
                return (
                  <motion.li
                    key={f.q}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.45, delay: i * 0.05 }}
                    className="relative"
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className={cn(
                        "group relative grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-5 rounded-2xl border p-5 text-left backdrop-blur transition-all md:p-6",
                        isOpen
                          ? "border-accent/40 bg-gradient-to-br from-accent/[0.08] via-white/[0.04] to-transparent shadow-[0_20px_60px_-25px_hsl(var(--accent)/0.6)]"
                          : "border-white/8 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
                      )}
                    >
                      {/* Number node */}
                      <span className="relative z-10 grid h-[52px] w-[52px] shrink-0 place-items-center">
                        <span
                          className={cn(
                            "absolute inset-0 rounded-2xl p-[1.5px] transition-all",
                            isOpen
                              ? "bg-gradient-to-br from-accent via-accent/70 to-primary/60"
                              : "bg-gradient-to-br from-white/20 to-white/5 group-hover:from-accent/40",
                          )}
                        >
                          <span
                            className={cn(
                              "block h-full w-full rounded-2xl",
                              isOpen ? "bg-accent text-accent-foreground" : "bg-[hsl(220_55%_11%)] text-white/75",
                            )}
                          />
                        </span>
                        <span
                          className={cn(
                            "relative font-display text-base font-bold",
                            isOpen ? "text-accent-foreground" : "text-white/75",
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {isOpen && (
                          <motion.span
                            aria-hidden
                            animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                            className="absolute inset-0 rounded-2xl border border-accent"
                          />
                        )}
                      </span>

                      {/* Content */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em]",
                              isOpen ? "bg-accent/20 text-accent" : "bg-white/8 text-white/45",
                            )}
                          >
                            Q.{String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h3
                          className={cn(
                            "mt-2 font-display text-base font-semibold leading-snug transition-colors md:text-lg",
                            isOpen ? "text-white" : "text-white/85 group-hover:text-white",
                          )}
                        >
                          {f.q}
                        </h3>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 flex gap-3 border-l-2 border-accent/60 pl-4">
                                <p className="text-sm leading-relaxed text-white/70 md:text-[15px]">{f.a}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Toggle indicator */}
                      <span
                        className={cn(
                          "relative grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all",
                          isOpen
                            ? "border-accent/50 bg-accent/15 text-accent"
                            : "border-white/12 bg-white/[0.04] text-white/70 group-hover:border-white/30 group-hover:text-white",
                        )}
                      >
                        <motion.span
                          aria-hidden
                          animate={{ rotate: isOpen ? 90 : 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="relative block h-3.5 w-3.5"
                        >
                          <span className="absolute left-1/2 top-1/2 h-[2px] w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current" />
                          <motion.span
                            animate={{ scaleX: isOpen ? 0 : 1 }}
                            transition={{ duration: 0.3 }}
                            className="absolute left-1/2 top-1/2 h-3.5 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
                          />
                        </motion.span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
