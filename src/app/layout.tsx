import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma, safeDbQuery } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

function toTelHref(value?: string | null) {
  const cleaned = (value ?? "").replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "tel:+33000000000";
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await safeDbQuery(() => prisma.siteSetting.findFirst(), null);
  const company = s?.companyName?.trim() || "ELMAT";
  const title = s?.seoTitle || `${company} - Maçonnerie, rénovation et démolition en Haute-Savoie`;
  const description =
    s?.seoDescription ||
    s?.description ||
    "Entreprise de maçonnerie, rénovation, démolition, dalle béton et chape en Haute-Savoie (74), à proximité de Genève.";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const image =
    s?.heroImageUrl ||
    s?.logoUrl ||
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80";

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: {
      canonical: base,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      url: base,
      siteName: company,
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await safeDbQuery(() => prisma.siteSetting.findFirst(), null);
  const phoneHref = toTelHref(settings?.phone);
  const phoneLabel = settings?.phone?.trim() || "Appeler";

  return (
    <html lang="fr" className={manrope.variable} data-theme="slate" data-appearance="dark">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="" />
      </head>
      <body className="min-h-screen bg-zinc-100 text-zinc-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[200] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-zinc-900"
        >
          Aller au contenu principal
        </a>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){document.documentElement.setAttribute('data-theme','slate');document.documentElement.setAttribute('data-appearance','dark');})();",
          }}
        />
        <Header />
        <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 pb-24 md:pb-10">{children}</main>
        <div
          className="fixed inset-x-0 bottom-0 z-50 border-t p-3 shadow-[0_-14px_36px_rgba(0,0,0,0.28)] backdrop-blur md:hidden"
          style={{ backgroundColor: "var(--header-bg)", borderColor: "var(--header-border)" }}
        >
          <div className="mx-auto flex max-w-6xl gap-2">
            <a href={phoneHref} className="flex-1 rounded border border-white/20 bg-white/10 px-3 py-2 text-center text-sm font-semibold text-white">
              {phoneLabel}
            </a>
            <a
              href="/contact"
              className="flex-1 rounded px-3 py-2 text-center text-sm font-semibold"
              style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
            >
              Devis
            </a>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
