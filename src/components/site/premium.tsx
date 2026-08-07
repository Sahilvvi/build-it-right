import { motion } from "framer-motion";
import type { ReactNode } from "react";

/* Dark navy ambient backdrop — dot grid + 2 animated motion orbs + center glow */
export function AmbientDark() {
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

/* Light ambient backdrop — grid + 2 animated motion orbs */
export function AmbientLight() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--primary)/0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)/0.4) 1px, transparent 1px)",
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

/* Premium animated orbs for any dark hero (drop-in replacement for static blob backdrops) */
export function PremiumOrbs() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(hsl(var(--accent)) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      <motion.div
        animate={{ x: [0, 28, 0], y: [0, -22, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -24, 0], y: [0, 24, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-40 top-1/3 h-[560px] w-[560px] rounded-full bg-white/10 blur-3xl"
      />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,hsl(var(--accent)/0.18),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
    </>
  );
}

/* Eyebrow badge with animated ping dot — for any tone */
export function EyebrowBadge({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: -8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={
        "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] backdrop-blur " +
        (tone === "dark"
          ? "border-white/20 bg-white/10 text-white/85"
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

/* Reusable gradient italic span — drop into any heading */
export function GradientAccent({ children }: { children: ReactNode }) {
  return (
    <span className="italic bg-gradient-to-r from-accent via-accent to-accent/70 bg-clip-text text-transparent pr-[0.2em] -mr-[0.2em]">
      {children}
    </span>
  );
}

/* Premium gradient-bordered card wrapper */
export function GradientBorder({
  children,
  className = "",
  rounded = "rounded-3xl",
}: {
  children: ReactNode;
  className?: string;
  rounded?: string;
}) {
  return (
    <div className={"relative " + rounded + " p-[1px] " + className}>
      <span
        className={
          "absolute inset-0 " +
          rounded +
          " bg-gradient-to-br from-accent/40 via-white/10 to-primary/40"
        }
      />
      <div className={"relative " + rounded.replace("rounded-", "rounded-[calc(") + " bg-card"}>
        {children}
      </div>
    </div>
  );
}
