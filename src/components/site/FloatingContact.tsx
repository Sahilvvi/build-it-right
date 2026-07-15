import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, Mail, X, Plus } from "lucide-react";
import { brand } from "@/data/site";

export function FloatingContact() {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: MessageCircle, label: "WhatsApp", href: `https://wa.me/${brand.whatsapp.replace(/\D/g, "")}`, color: "bg-emerald-500" },
    { icon: Phone, label: "Call us", href: `tel:${brand.phone.replace(/\s/g, "")}`, color: "bg-blue-500" },
    { icon: Mail, label: "Email", href: `mailto:${brand.email}`, color: "bg-indigo-500" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open &&
          actions.map((a, i) => (
            <motion.a
              key={a.label}
              href={a.href}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              transition={{ delay: i * 0.05, duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="group flex items-center gap-3"
            >
              <span className="rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background opacity-0 transition-opacity group-hover:opacity-100">
                {a.label}
              </span>
              <span className={`grid h-12 w-12 place-items-center rounded-full ${a.color} text-white shadow-elevated`}>
                <a.icon className="h-5 w-5" />
              </span>
            </motion.a>
          ))}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label="Contact"
        whileTap={{ scale: 0.94 }}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-brand text-primary-foreground shadow-glow"
      >
        <motion.span
          className="absolute inset-0 rounded-full bg-primary opacity-30"
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
      </motion.button>
    </div>
  );
}
