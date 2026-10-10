import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, LogIn } from "lucide-react";
import { brand } from "@/data/site";
import { useAdminStore } from "@/lib/admin-store";
import { isValidLinkTarget, normalisePath } from "@/lib/links";
import { toInternalPath } from "@/lib/pages";
import { SiteLink } from "./SiteLink";
const logoAsset = { url: "/finenvision-logo-light.png" };
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/** Top notice bar. One active notice is static; several rotate, pausing while hovered. */
function AnnouncementBar({ notices, seconds }: { notices: string[]; seconds: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = notices.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % count),
      Math.max(2, seconds) * 1000,
    );
    return () => window.clearInterval(id);
  }, [count, paused, seconds]);

  if (count === 0) return null;
  const text = notices[index % count];

  return (
    <div
      className="hidden border-b border-border/40 bg-secondary/90 py-2 text-center text-[13px] text-foreground/85 backdrop-blur md:block"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-2 font-semibold text-primary">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-accent" />
        <span
          key={text}
          className="animate-in fade-in slide-in-from-bottom-1 duration-300 motion-reduce:animate-none"
        >
          {text}
        </span>
        {count > 1 && (
          <span className="ml-1 text-[11px] font-medium text-muted-foreground tabular-nums">
            {(index % count) + 1}/{count}
          </span>
        )}
      </span>
    </div>
  );
}

export function Navbar() {
  const store = useAdminStore();
  const { navigation: nav } = store;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const links = nav.links.filter((l) => l.isActive && l.label.trim() && isValidLinkTarget(l.to));
  const notices = useMemo(
    () =>
      store.announcements
        .filter((a) => a.isActive && a.text.trim())
        .sort((a, b) => a.priority - b.priority)
        .map((a) => a.text),
    [store.announcements],
  );

  const login = nav.loginButton;
  const showLogin = login.enabled && isValidLinkTarget(login.url);
  const orgCode = login.showOrgCode ? store.homeContent.appSection.orgCode?.trim() : "";
  const phone = store.identity.phone || brand.phone;
  const loginTarget = login.openInNewTab ? "_blank" : undefined;
  const loginRel = login.openInNewTab ? "noopener noreferrer" : undefined;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      {nav.announcementBar.enabled && (
        <AnnouncementBar notices={notices} seconds={nav.announcementBar.rotateSeconds} />
      )}

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
            {links.map((l) => {
              const active = normalisePath(toInternalPath(l.to)) === pathname;
              return (
                <SiteLink
                  key={l.id}
                  to={l.to}
                  openInNewTab={l.openInNewTab}
                  className={cn(
                    "relative touch-manipulation rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors duration-200",
                    active
                      ? "bg-background text-primary shadow-soft"
                      : "text-foreground/70 hover:bg-background/60 hover:text-foreground",
                  )}
                >
                  {l.label}
                </SiteLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {nav.showPhoneButton && (
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="hidden h-10 items-center gap-2 rounded-full border border-border/70 px-4 text-sm font-semibold text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary md:inline-flex"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">{phone}</span>
              </a>
            )}
            {showLogin && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={login.url}
                      target={loginTarget}
                      rel={loginRel}
                      className="btn-sheen group hidden h-10 items-center gap-2 rounded-full bg-gradient-to-r from-primary via-[#0077ee] to-primary px-5 text-sm font-semibold tracking-wide text-white shadow-[0_4px_16px_rgba(0,109,218,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_25px_rgba(0,109,218,0.5)] md:inline-flex"
                    >
                      <LogIn className="h-4 w-4" />
                      {login.label || "Login"}
                    </a>
                  </TooltipTrigger>
                  {(login.tooltipTitle || orgCode) && (
                    <TooltipContent className="z-50 max-w-xs rounded-xl border border-border bg-popover p-3 text-popover-foreground shadow-lg">
                      {login.tooltipTitle && (
                        <p className="text-xs font-semibold text-primary">{login.tooltipTitle}</p>
                      )}
                      {orgCode && (
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Use Org Code:{" "}
                          <strong className="rounded bg-accent/20 px-1 py-0.5 font-mono font-bold text-foreground">
                            {orgCode}
                          </strong>
                        </p>
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            )}

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
                  {links.map((l) => (
                    <SiteLink
                      key={l.id}
                      to={l.to}
                      openInNewTab={l.openInNewTab}
                      onClick={() => setOpen(false)}
                      className="touch-manipulation rounded-lg px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-secondary"
                    >
                      {l.label}
                    </SiteLink>
                  ))}
                  {showLogin && (
                    <>
                      <a
                        href={login.url}
                        target={loginTarget}
                        rel={loginRel}
                        onClick={() => setOpen(false)}
                        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold tracking-wide text-primary-foreground"
                      >
                        <LogIn className="h-4 w-4" /> {login.label || "Login"}
                      </a>
                      {orgCode && (
                        <div className="mt-1 px-3 text-center text-[11px] text-muted-foreground">
                          Use Org Code:{" "}
                          <strong className="font-mono font-semibold text-primary">
                            {orgCode}
                          </strong>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
