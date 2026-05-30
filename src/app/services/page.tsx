export const revalidate = 600;
import { prisma } from "@/lib/prisma";
import { ServicesDynamicGrid } from "@/components/public/ServicesDynamicGrid";
import { getDefaultMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getDefaultMetadata(
    "Services de maconnerie et renovation en Haute-Savoie",
    "Maconnerie generale, renovation interieure et exterieure, demolition, dalle beton, chape, murs et travaux techniques en Haute-Savoie (74), a proximite de Geneve."
  );
}

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { isPublished: true }, orderBy: { position: "asc" } });
  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl bg-zinc-900 p-7 text-zinc-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.2),transparent_35%)]" />
        <h1 className="text-3xl font-bold">Nos services</h1>
        <p className="mt-2 text-zinc-300">
          Une presentation dynamique de nos prestations en maconnerie, renovation, demolition et travaux techniques.
        </p>
      </header>

      <ServicesDynamicGrid services={services} />
    </div>
  );
}

