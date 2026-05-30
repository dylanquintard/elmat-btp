import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

export const revalidate = 300;

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
  const s = await prisma.siteSetting.findFirst();
  const title = s?.seoTitle || s?.companyName || "Entreprise BTP";
  const description =
    s?.seoDescription ||
    s?.description ||
    "Entreprise BTP locale pour vos travaux de maconnerie, renovation et demolition.";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    metadataBase: new URL(base),
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fr_FR",
      url: base,
      siteName: s?.companyName || "Entreprise BTP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSetting.findFirst();
  const phoneHref = toTelHref(settings?.phone);
  const phoneLabel = settings?.phone?.trim() || "Appeler";

  return (
    <html lang="fr" className={manrope.variable}>
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
              "(function(){try{var t=localStorage.getItem('elmat-theme');var a=localStorage.getItem('elmat-appearance');document.documentElement.setAttribute('data-theme',t||'steel');document.documentElement.setAttribute('data-appearance',a==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','steel');document.documentElement.setAttribute('data-appearance','light');}})();",
          }}
        />
        <Header />
        <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 pb-24 md:pb-10">{children}</main>
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 p-3 shadow-lg backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl gap-2">
            <a href={phoneHref} className="flex-1 rounded bg-zinc-900 px-3 py-2 text-center text-sm font-semibold text-white">
              {phoneLabel}
            </a>
            <a href="/contact" className="flex-1 rounded bg-amber-500 px-3 py-2 text-center text-sm font-semibold text-zinc-900">
              Devis
            </a>
          </div>
        </div>
        <Footer />
      </body>
    </html>
  );
}
