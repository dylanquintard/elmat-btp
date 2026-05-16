export const revalidate = 300;
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProjectShowcaseCard } from "@/components/public/ProjectShowcaseCard";
import { getDefaultMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getDefaultMetadata(
    "Realisations BTP en Haute-Savoie",
    "Decouvrez nos chantiers de maconnerie et renovation en Haute-Savoie et proximite Geneve cote France : avant/apres, details d'intervention et resultats."
  );
}

function getFirstByType(
  images: Array<{ url: string; alt: string | null; type: "BEFORE" | "AFTER" | "DURING" | "GENERAL" }>,
  type: "BEFORE" | "AFTER"
) {
  return images.find((img) => img.type === type) ?? images.find((img) => img.type === "GENERAL") ?? images[0];
}

type RealisationsPageProps = {
  searchParams: Promise<{ city?: string; service?: string }>;
};

export default async function RealisationsPage({ searchParams }: RealisationsPageProps) {
  const params = await searchParams;
  const activeCity = params.city?.trim() || "";
  const activeService = params.service?.trim() || "";

  const projects = await prisma.project.findMany({
    where: {
      isPublished: true,
      city: activeCity ? { equals: activeCity, mode: "insensitive" } : undefined,
      service: activeService
        ? {
            slug: activeService,
          }
        : undefined,
    },
    orderBy: { position: "asc" },
    include: {
      images: { orderBy: { position: "asc" } },
      service: { select: { slug: true, title: true } },
    },
  });

  const [cities, services] = await Promise.all([
    prisma.project.findMany({
      where: { isPublished: true, city: { not: null } },
      distinct: ["city"],
      select: { city: true },
      orderBy: { city: "asc" },
    }),
    prisma.project.findMany({
      where: { isPublished: true, serviceId: { not: null } },
      distinct: ["serviceId"],
      select: {
        service: {
          select: { slug: true, title: true, isPublished: true },
        },
      },
    }),
  ]);

  const availableServices = services
    .map((entry) => entry.service)
    .filter((service): service is { slug: string; title: string; isPublished: boolean } => Boolean(service))
    .filter((service) => service.isPublished)
    .sort((a, b) => a.title.localeCompare(b.title, "fr"));

  return (
    <div className="space-y-10">
      <header className="relative overflow-hidden rounded-2xl bg-zinc-900 p-8 text-zinc-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.2),transparent_35%)]" />
        <h1 className="text-4xl font-bold">Nos chantiers & realisations</h1>
        <p className="mt-3 max-w-3xl text-zinc-300">
          Avant/apres, synthese des interventions et acces rapide vers le detail complet de chaque chantier.
        </p>
      </header>

      <section className="rounded-xl border bg-white p-4">
        <p className="mb-2 text-sm font-semibold text-zinc-700">Filtrer les chantiers</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/realisations"
            className={`rounded border px-3 py-1 text-sm ${
              !activeCity && !activeService ? "border-zinc-900 bg-zinc-900 text-white" : ""
            }`}
          >
            Tout
          </Link>
          {cities.map((c) =>
            c.city ? (
              <Link
                key={c.city}
                href={`/realisations?city=${encodeURIComponent(c.city)}`}
                className={`rounded border px-3 py-1 text-sm ${
                  activeCity.toLowerCase() === c.city.toLowerCase() ? "border-zinc-900 bg-zinc-900 text-white" : ""
                }`}
              >
                {c.city}
              </Link>
            ) : null
          )}
          {availableServices.map((s) => (
            <Link
              key={s.slug}
              href={`/realisations?service=${encodeURIComponent(s.slug)}`}
              className={`rounded border px-3 py-1 text-sm ${
                activeService.toLowerCase() === s.slug.toLowerCase()
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-amber-300 bg-amber-50"
              }`}
            >
              {s.title}
            </Link>
          ))}
        </div>
      </section>

      <div className="space-y-8">
        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-zinc-600">
            Aucun chantier ne correspond au filtre selectionne.
          </div>
        ) : null}

        {projects.map((p) => {
          const before = getFirstByType(p.images, "BEFORE");
          const after = getFirstByType(p.images, "AFTER");

          return (
            <ProjectShowcaseCard
              key={p.id}
              slug={p.slug}
              title={p.title}
              summary={p.description}
              city={p.city}
              duration={p.duration}
              beforeUrl={before?.url}
              afterUrl={after?.url}
              beforeLabel={before?.alt ?? p.problem ?? "Etat avant intervention"}
              afterLabel={after?.alt ?? p.solution ?? "Resultat final apres travaux"}
            />
          );
        })}
      </div>
    </div>
  );
}
