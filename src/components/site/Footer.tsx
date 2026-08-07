import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles, Linkedin, Instagram, Youtube, MessageCircle, ArrowUpRight,
  Mail, Phone, MapPin,
} from "lucide-react";
import { brand } from "@/data/site";
const logoAsset = { url: "/finenvision-logo-light.png" };


const cols = [
  {
    title: "Company",
    items: [
      { l: "About Us", to: "/about" },
    ],
  },
  {
    title: "Resources",
    items: [
      { l: "Blog", to: "/resources" },
      { l: "Case Studies", to: "/resources" },
      { l: "YouTube", to: "/resources" },
    ],
  },
  {
    title: "Support",
    items: [
      { l: "Contact Us", to: `https://wa.me/${brand.whatsapp.replace(/\D/g, "")}?text=Enquiry%20for%20CFA` },
    ],
  },
];




const SOCIALS = [
  { Icon: Linkedin, href: "https://www.linkedin.com/in/manojrajgopal?utm_source=share_via&utm_content=profile&utm_medium=member_android", label: "LinkedIn" },
  { Icon: Instagram, href: "https://www.instagram.com/finenvision.cfa?igsh=MWl0eDN4OXFjdWhucA==", label: "Instagram" },
  { Icon: Youtube, href: "https://www.youtube.com/@financewithmanojrajgopal", label: "YouTube" },
  { Icon: MessageCircle, href: "https://wa.me/917304833625?text=Enquiry%20for%20CFA", label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[hsl(220_55%_10%)] text-primary-foreground">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(hsl(var(--accent))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--accent))_1px,transparent_1px)] [background-size:48px_48px]" />
      <div className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-primary/40 blur-3xl" />




      {/* Main grid */}
      <div className="container-px relative mx-auto max-w-7xl pb-10 pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          {/* Brand block */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label={brand.name}>
              <img src={logoAsset.url} alt={brand.name} className="h-16 w-auto" />
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              {brand.description}
            </p>

            <ul className="mt-7 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>{brand.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {brand.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a href={`mailto:${brand.email}`} className="hover:text-white">
                  {brand.email}
                </a>
              </li>
            </ul>

            <div className="mt-7 flex gap-2.5">
              {SOCIALS.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  whileHover={{ y: -3, scale: 1.08 }}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/[0.04] text-white/70 transition-all hover:border-accent/50 hover:bg-accent/15 hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.title}>
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-accent" />
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
                  {c.title}
                </div>
              </div>
              <ul className="mt-5 space-y-1 text-sm">
                {c.items.map((i) => (
                  <li key={i.l}>
                    {i.to.startsWith("http") ? (
                      <a
                        href={i.to}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex w-full items-center gap-1.5 rounded-lg py-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <span className="relative">
                          {i.l}
                          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all group-hover:w-full" />
                        </span>
                        <ArrowUpRight className="h-3 w-3 -translate-x-1 text-accent/70 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </a>
                    ) : (
                      <Link
                        to={i.to}
                        className="group flex w-full items-center gap-1.5 rounded-lg py-2 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <span className="relative">
                          {i.l}
                          <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all group-hover:w-full" />
                        </span>
                        <ArrowUpRight className="h-3 w-3 -translate-x-1 text-accent/70 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/55 md:flex-row md:items-center">
          <div>
            © {new Date().getFullYear()} {brand.name}. Crafted with intent in Mumbai.
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/contact" className="transition-colors hover:text-white">Privacy</Link>
            <Link to="/contact" className="transition-colors hover:text-white">Terms</Link>
            <Link to="/contact" className="transition-colors hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
