"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemePicker } from "@/components/layout/ThemePicker";

type HeaderClientProps = {
  companyName: string;
  logoUrl: string | null;
  compactLogoUrl?: string | null;
  phoneLabel: string;
  phoneHref: string;
};

export function HeaderClient({ companyName, logoUrl, compactLogoUrl, phoneLabel, phoneHref }: HeaderClientProps) {
  const [isCompact, setIsCompact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const compactView = isCompact || isMobile;

  useEffect(() => {
    // Always close mobile menu on route change to avoid stale overlay blocking scroll.
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    // Prevent background scroll only while the mobile menu is open.
    if (!mobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 64;
      setIsCompact((prev) => (prev === next ? prev : next));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{ backgroundColor: "var(--header-bg)", borderColor: "var(--header-border)" }}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-200 ${compactView ? "h-20" : "h-40"}`}
        style={{ color: "var(--header-text)" }}
      >
        <Link
          href="/"
          className={`relative flex shrink-0 items-center overflow-hidden gap-3 font-semibold tracking-wide transition-all duration-200 ${compactView ? "h-16 w-[220px] md:w-[320px]" : "h-36 w-[360px] md:w-[780px]"}`}
        >
          {logoUrl ? (
            <>
              <span
                className={`pointer-events-none absolute left-0 top-1/2 h-full -translate-y-1/2 overflow-hidden transition-opacity duration-200 ${compactView ? "opacity-0" : "opacity-100"}`}
                aria-hidden={compactView}
              >
                <Image
                  src={logoUrl}
                  alt={`Logo ${companyName}`}
                  width={840}
                  height={248}
                  priority
                  sizes="(max-width: 768px) 520px, 840px"
                  className="h-full w-auto max-h-full object-contain"
                />
              </span>
              {compactLogoUrl ? (
                <span
                  className={`pointer-events-none absolute left-0 top-1/2 overflow-hidden transition-opacity duration-200 ${compactView ? "h-[64%] -translate-y-1/2 opacity-100" : "h-[92%] -translate-y-1/2 opacity-0"}`}
                  aria-hidden={!compactView}
                >
                  <Image
                    src={compactLogoUrl}
                    alt={`Logo compact ${companyName}`}
                    width={840}
                    height={248}
                    sizes="(max-width: 768px) 520px, 840px"
                    className="h-full w-auto max-h-full object-contain"
                  />
                </span>
              ) : (
                <span
                  className={`text-sm uppercase tracking-[0.12em] transition-opacity duration-200 ${compactView ? "opacity-100" : "opacity-0"}`}
                  aria-hidden={!compactView}
                >
                  Accueil
                </span>
              )}
            </>
          ) : (
            <span className="text-sm uppercase tracking-[0.12em]">
              {isCompact ? "Accueil" : companyName}
            </span>
          )}
        </Link>
        <nav className={`absolute left-1/2 hidden -translate-x-1/2 items-center justify-center text-base md:flex ${compactView ? "gap-6 lg:gap-8" : "gap-8 lg:gap-10"}`}>
          <Link href="/services" aria-current={pathname === "/services" ? "page" : undefined}>Services</Link>
          <Link href="/realisations" aria-current={pathname === "/realisations" ? "page" : undefined}>Nos Chantiers</Link>
          <Link href="/contact" aria-current={pathname === "/contact" ? "page" : undefined}>Devis</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
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
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          style={{ top: compactView ? "5rem" : "10rem" }}
          onClick={() => setMobileMenuOpen(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") setMobileMenuOpen(false);
          }}
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
