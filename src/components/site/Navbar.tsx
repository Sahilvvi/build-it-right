import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, LogIn } from "lucide-react";
import { navLinks, brand } from "@/data/site";
import { useAdminStore } from "@/lib/admin-store";
const logoAsset = { url: "/finenvision-logo-light.png" };
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Navbar() {
  const store = useAdminStore();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const activeAnnouncement =
    store.announcements.find((a) => a.isActive)?.text ||
    "Welcome to Fin-Envision Learning — An Educator to the Financial Markets";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {/* Top announcement bar — Dynamic from Admin Notice Marquee */}
      <div className="hidden bg-secondary/90 py-2 text-center text-[13px] text-foreground/85 backdrop-blur md:block border-b border-border/40">
        <span className="inline-flex items-center gap-2 font-semibold text-primary">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse shrink-0" />
          {activeAnnouncement}
        </span>
      </div>

      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border/60 bg-background/90 shadow-soft backdrop-blur-xl"
            : "border-b border-transparent bg-background/70 backdrop-blur-md",
        )}
      >
        <div className="container-px mx-auto flex max-w-7xl items-center justify-between gap-6 py-3">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label={store.identity.name || brand.name}
          >
            <img
              src={store.visuals?.logoUrl || logoAsset.url}
              alt={store.identity.name || brand.name}
              className="h-12 w-auto md:h-14"
              loading="eager"
              decoding="async"
            />
          </Link>

          <nav className="hidden items-center gap-0.5 rounded-full border border-border/60 bg-secondary/40 px-1.5 py-1 backdrop-blur lg:flex">
            {navLinks.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  preload="intent"
                  className={cn(
                    "relative touch-manipulation rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors duration-200",
                    active
                      ? "bg-background text-primary shadow-soft"
                      : "text-foreground/70 hover:bg-background/60 hover:text-foreground",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${(store.identity.phone || brand.phone).replace(/\s/g, "")}`}
              className="hidden h-10 items-center gap-2 rounded-full border border-border/70 px-4 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary md:inline-flex"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">{store.identity.phone || brand.phone}</span>
            </a>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a
                    href="https://web.classplusapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-sheen group hidden h-10 items-center gap-2 rounded-full bg-gradient-to-r from-primary via-[#0077ee] to-primary px-5 text-sm font-semibold tracking-wide text-white shadow-[0_4px_16px_rgba(0,109,218,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(0,109,218,0.5)] md:inline-flex"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </a>
                </TooltipTrigger>
                <TooltipContent className="bg-popover border border-border text-popover-foreground p-3 rounded-xl shadow-lg max-w-xs z-50">
                  <p className="font-semibold text-xs text-primary">Classplus Login Portal</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Use Org Code:{" "}
                    <strong className="font-mono text-foreground bg-accent/20 px-1 py-0.5 rounded font-bold">
                      RJQBWG
                    </strong>
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="container-px mx-auto max-w-7xl pb-4 lg:hidden"
            >
              <div className="rounded-2xl border border-border bg-background p-3 shadow-elevated">
                <div className="flex flex-col gap-1">
                  {navLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      preload="intent"
                      onClick={() => setOpen(false)}
                      className="touch-manipulation rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <a
                    href="https://web.classplusapp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold tracking-wide text-primary-foreground"
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </a>
                  <div className="mt-1 px-3 text-[11px] text-muted-foreground text-center">
                    Use Org Code:{" "}
                    <strong className="font-mono text-primary font-semibold">RJQBWG</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
