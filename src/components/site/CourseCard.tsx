import { motion } from "framer-motion";
import { Star, Users, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Course } from "@/data/site";

export function CourseCard({ course }: { course: Course }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-card"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gradient-brand opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-25" />

      <div className="flex items-center justify-between">
        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {course.format}
        </span>
        {course.badge && (
          <span className="rounded-full bg-gradient-brand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
            {course.badge}
          </span>
        )}
      </div>

      <h3 className="mt-5 font-display text-xl font-semibold leading-tight tracking-tight">{course.title}</h3>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" />{course.learners.toLocaleString()} learners</span>
        <span className="inline-flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-accent text-accent" />{course.rating}</span>
      </div>

      <ul className="mt-5 grid gap-2 text-sm">
        {course.outcomes.slice(0, 3).map((o) => (
          <li key={o} className="flex items-start gap-2 text-foreground/80">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {o}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-end justify-between pt-6">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Starts from</div>
          <div className="font-display text-2xl font-semibold">{course.price}</div>
        </div>
        <Link
          to="/courses"
          className="group/btn inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
        >
          Know more
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}
