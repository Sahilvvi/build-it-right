import { hiringCompanies } from "@/data/site";
import { Building2 } from "lucide-react";

type Props = { reverse?: boolean; speed?: string };

export function CompaniesMarquee({ reverse = false, speed = "40s" }: Props) {
  const list = [...hiringCompanies, ...hiringCompanies];
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-[hsl(220_60%_10%)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-[hsl(220_60%_10%)] to-transparent" />
      <div
        className="flex w-max gap-4 animate-marquee"
        style={{
          animationDuration: speed,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {list.map((c, i) => (
          <div
            key={i}
            className="group relative flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 backdrop-blur transition-all hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.08] hover:shadow-[0_20px_40px_-20px_hsl(var(--accent)/0.5)]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-accent/25 to-primary/30 text-accent ring-1 ring-white/10">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="whitespace-nowrap font-display text-lg font-semibold tracking-tight text-white/75 transition-colors group-hover:text-white md:text-xl">
              {c}
            </span>
            <span className="pointer-events-none absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
