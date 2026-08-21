import { type Metadata } from "next";
import { prisma, safeDbQuery } from "@/lib/prisma";

const FALLBACK_OG_IMAGE =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80";

type MetadataOptions = {
  path?: string;
  image?: string;
};

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export async function getDefaultMetadata(title?: string, description?: string, options?: MetadataOptions): Promise<Metadata> {
  const settings = await safeDbQuery(() => prisma.siteSetting.findFirst(), null);
  const base = getBaseUrl();
  const company = settings?.companyName?.trim() || "ELMAT";
  const metaTitle = title ?? settings?.seoTitle ?? `${company} - Maçonnerie et rénovation en Haute-Savoie`;
  const metaDescription =
    description ??
    settings?.seoDescription ??
    settings?.description ??
    "Entreprise de maçonnerie, rénovation, démolition, dalle béton et chape en Haute-Savoie (74), à proximité de Genève.";
  const metaImage = options?.image || settings?.heroImageUrl || settings?.logoUrl || FALLBACK_OG_IMAGE;
  const canonical = options?.path ? `${base}${options.path}` : base;

  return {
    metadataBase: new URL(base),
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "website",
      locale: "fr_FR",
      url: canonical,
      siteName: company,
      images: [{ url: metaImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
  };
}

export async function getNapData() {
  const s = await safeDbQuery(() => prisma.siteSetting.findFirst(), null);
  return {
    companyName: s?.companyName?.trim() || "ELMAT",
    phone: s?.phone?.trim() || "+33 0 00 00 00 00",
    email: s?.email?.trim() || "contact@elmat74.fr",
    address: s?.address?.trim() || "",
    city: s?.city?.trim() || "Valleiry",
    postalCode: s?.postalCode?.trim() || "",
    country: s?.country?.trim() || "France",
    googleMapsUrl: s?.googleMapsUrl?.trim() || "",
    openingHours: s?.openingHours?.trim() || "",
    description: s?.description?.trim() || "Travaux de maçonnerie, rénovation, démolition et aménagement en Haute-Savoie.",
    heroImageUrl: s?.heroImageUrl?.trim() || "",
    logoUrl: s?.logoUrl?.trim() || "",
  };
}

export async function getLocalBusinessJsonLd() {
  const s = await getNapData();
  const base = getBaseUrl();

  return {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: s.companyName,
    description: s.description,
    telephone: s.phone,
    email: s.email,
    hasMap: s.googleMapsUrl || undefined,
    address: s.address
      ? {
          "@type": "PostalAddress",
          streetAddress: s.address,
          addressLocality: s.city,
          postalCode: s.postalCode || undefined,
          addressCountry: s.country,
        }
      : undefined,
    areaServed: [
      "Haute-Savoie",
      "Valleiry",
      "Viry",
      "Saint-Julien-en-Genevois",
      "Vers",
      "Cruseilles",
      "Annemasse",
      "Annecy",
      "Valserhone",
      "Gex",
      "Divonne-les-Bains",
      "Frangy",
      "La Roche-sur-Foron",
      "Neydens",
      "Proximité Genève (74)",
    ],
    image: s.heroImageUrl || s.logoUrl || FALLBACK_OG_IMAGE,
    url: base,
    priceRange: "€€",
  };
}
