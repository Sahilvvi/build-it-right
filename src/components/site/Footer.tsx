/** @jsxImportSource @/lib/editable */
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Linkedin,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  MessageCircle,
  ArrowUpRight,
  Mail,
  Phone,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { brand } from "@/data/site";
import { useAdminStore, type SocialPlatform } from "@/lib/admin-store";
import { isValidLinkTarget } from "@/lib/links";
import { SiteLink } from "./SiteLink";
const logoAsset = { url: "/finenvision-logo-light.png" };

const SOCIAL_META: Record<SocialPlatform, { Icon: LucideIcon; label: string }> = {
  linkedin: { Icon: Linkedin, label: "LinkedIn" },
  instagram: { Icon: Instagram, label: "Instagram" },
  youtube: { Icon: Youtube, label: "YouTube" },
  whatsapp: { Icon: MessageCircle, label: "WhatsApp" },
  facebook: { Icon: Facebook, label: "Facebook" },
  x: { Icon: Twitter, label: "X (Twitter)" },
};

export function Footer() {
  const store = useAdminStore();
  const { footer } = store;
  const logo = store.visuals?.logoUrl || logoAsset.url;
  const description = store.identity.footerBlurb || store.identity.description || brand.description;
  const address = store.identity.address || brand.address;
  const phone = store.identity.phone || brand.phone;
  const email = store.identity.email || brand.email;

  const columns = footer.columns
    .map((c) => ({
      ...c,
      links: c.links.filter((l) => l.isActive && l.label.trim() && isValidLinkTarget(l.to)),
    }))
    .filter((c) => c.links.length > 0);
  const socials = footer.socials.filter((s) => s.isActive && isValidLinkTarget(s.url));
  const legal = footer.legalLinks.filter(
    (l) => l.isActive && l.label.trim() && isValidLinkTarget(l.to),
  );

  const linkClass =
    "group flex w-full items-center gap-1.5 rounded-lg py-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white";

  return (
    <footer className="relative overflow-hidden bg-[hsl(220_55%_10%)] text-primary-foreground">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(hsl(var(--accent))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--accent))_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/40 blur-3xl" />

      {/* Main grid */}
      <div className="container-px relative mx-auto max-w-7xl pb-10 pt-20">
        <div
          className="grid gap-12 lg:[grid-template-columns:var(--footer-cols)]"
          style={
            {
              "--footer-cols": `1.5fr repeat(${Math.max(columns.length, 1)}, 1fr)`,
            } as React.CSSProperties
          }
        >
          {/* Brand block */}
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-2.5"
              aria-label={store.identity.name || brand.name}
            >
              <img src={logo} alt={store.identity.name || brand.name} className="h-16 w-auto" />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">{description}</p>

            <ul className="mt-7 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${email}`} className="hover:text-white">
                  {email}
                </a>
              </li>
            </ul>

            {socials.length > 0 && (
              <div className="mt-7 flex gap-2.5">
                {socials.map(({ id, platform, url }) => {
                  const { Icon, label } = SOCIAL_META[platform];
                  return (
                    <motion.a
                      key={id}
                      href={url}
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -3, scale: 1.08 }}
                      className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.04] text-white/70 transition-all hover:border-accent/50 hover:bg-accent/15 hover:text-accent"
                    >
                      <Icon className="h-4 w-4" />
                    </motion.a>
                  );
                })}
              </div>
            )}
          </div>

          {columns.map((c) => (
            <div key={c.id}>
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-accent" />
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
                  {c.title}
                </div>
              </div>
              <ul className="mt-5 space-y-1 text-sm">
                {c.links.map((l) => (
                  <li key={l.id}>
                    <SiteLink to={l.to} openInNewTab={l.openInNewTab} className={linkClass}>
                      <span className="relative">
                        {l.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all group-hover:w-full" />
                      </span>
                      <ArrowUpRight className="h-3 w-3 -translate-x-1 text-accent/70 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </SiteLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pb-16 pt-7 text-xs text-white/55 md:flex-row md:items-center md:pb-0">
          <div>
            {store.identity.footerCopyright ||
              `© ${new Date().getFullYear()} ${store.identity.name || brand.name}. Crafted with intent in Mumbai.`}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <SiteLink
                key={l.id}
                to={l.to}
                openInNewTab={l.openInNewTab}
                className="transition-colors hover:text-white"
              >
                {l.label}
              </SiteLink>
            ))}
            {footer.showStaffPortalLink && (
              <Link to="/admin-login" className="text-white/40 transition-colors hover:text-white">
                Staff Portal
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
