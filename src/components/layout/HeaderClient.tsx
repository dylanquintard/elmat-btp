"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemePicker } from "@/components/layout/ThemePicker";

type HeaderClientProps = {
  companyName: string;
  logoUrl: string | null;
  phoneLabel: string;
  phoneHref: string;
};

export function HeaderClient({ companyName, logoUrl, phoneLabel, phoneHref }: HeaderClientProps) {
  const [isCompact, setIsCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      setIsCompact(window.scrollY > 64);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur transition-all duration-300"
      style={{ backgroundColor: "var(--header-bg)", borderColor: "var(--header-border)" }}
    >
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-300 ${isCompact ? "py-2.5" : "py-4"}`} style={{ color: "var(--header-text)" }}>
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-wide">
          {logoUrl ? (
            <>
              <span className={`block overflow-hidden transition-all duration-300 ${isCompact ? "max-h-0 opacity-0" : "max-h-40 opacity-100"}`}>
                <Image
                  src={logoUrl}
                  alt={`Logo ${companyName}`}
                  width={840}
                  height={248}
                  priority
                  sizes="(max-width: 768px) 520px, 840px"
                  className="h-32 w-auto object-contain md:h-40"
                />
              </span>
              <span className={`text-sm uppercase tracking-[0.12em] transition-all duration-300 ${isCompact ? "max-h-10 opacity-100" : "max-h-0 opacity-0"}`}>
                Accueil
              </span>
            </>
          ) : (
            <span className={`text-sm uppercase tracking-[0.12em] transition-opacity duration-300 ${isCompact ? "opacity-100" : "opacity-100"}`}>
              {isCompact ? "Accueil" : companyName}
            </span>
          )}
        </Link>
        <nav className="hidden gap-7 text-base md:flex">
          <Link href="/services" aria-current={pathname === "/services" ? "page" : undefined}>Services</Link>
          <Link href="/realisations" aria-current={pathname === "/realisations" ? "page" : undefined}>Nos Chantiers</Link>
          <Link href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}>Devis</Link>
        </nav>
        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            className="rounded border border-white/30 px-2.5 py-2 text-xs font-semibold uppercase tracking-wide md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-header-menu"
            aria-label="Ouvrir le menu"
          >
            Menu
          </button>
          <ThemePicker />
          <a
            href={phoneHref}
            className="hidden rounded px-3 py-2 text-sm font-semibold md:inline-block"
            style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
          >
            {phoneLabel}
          </a>
        </div>
      </div>
      {mobileMenuOpen ? (
        <button
          type="button"
          className="fixed inset-0 top-[56px] z-30 bg-black/20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Fermer le menu mobile"
        />
      ) : null}
      <div
        id="mobile-header-menu"
        className={`relative z-40 mx-auto max-w-6xl overflow-hidden px-4 transition-all duration-300 md:hidden ${mobileMenuOpen ? "max-h-72 pb-3" : "max-h-0 pb-0"}`}
      >
        <nav className="rounded-xl border border-white/20 bg-black/20 p-2">
          <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10" aria-current={pathname === "/" ? "page" : undefined}>Accueil</Link>
          <Link href="/services" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10" aria-current={pathname === "/services" ? "page" : undefined}>Services</Link>
          <Link href="/realisations" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10" aria-current={pathname === "/realisations" ? "page" : undefined}>Nos Chantiers</Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-white/10" aria-current={pathname === "/contact" ? "page" : undefined}>Devis</Link>
        </nav>
      </div>
    </header>
  );
}
