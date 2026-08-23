export const dynamic = "force-dynamic";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { ServicesDynamicGrid } from "@/components/public/ServicesDynamicGrid";
import { getDefaultMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getDefaultMetadata(
    "Services de maçonnerie et rénovation en Haute-Savoie",
    "Maçonnerie générale, rénovation intérieure et extérieure, démolition, dalle béton, chape, murs et travaux techniques en Haute-Savoie (74), à proximité de Genève.",
    { path: "/services" }
  );
}

export default async function ServicesPage() {
  const services = await safeDbQuery(
    () => prisma.service.findMany({ where: { isPublished: true }, orderBy: { position: "asc" } }),
    []
  );
  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl bg-zinc-900 p-7 text-zinc-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.2),transparent_35%)]" />
        <h1 className="text-3xl font-bold">Services de maçonnerie, rénovation et travaux techniques</h1>
        <p className="mt-2 max-w-3xl text-zinc-300">
          Des prestations concrètes pour vos chantiers en Haute-Savoie : dalle béton, chape, ouverture, mur, démolition, reprise de maçonnerie ou rénovation complète.
        </p>
        <a href="/contact" className="cta-amber mt-5 inline-flex rounded-lg border px-4 py-2 font-semibold transition">
          Demander un devis
        </a>
      </header>

      <ServicesDynamicGrid services={services} />
    </div>
  );
}

