import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { FloatingContact } from "./FloatingContact";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen text-foreground [overflow-x:clip]">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <FloatingContact />
    </div>
  );
}
