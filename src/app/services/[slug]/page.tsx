export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { getDefaultMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await safeDbQuery(() => prisma.service.findUnique({ where: { slug } }), null);

  if (!service) {
    return getDefaultMetadata("Service BTP", "Détails d'un service de maçonnerie et rénovation en Haute-Savoie.", {
      path: `/services/${slug}`,
    });
  }

  return getDefaultMetadata(
    service.seoTitle || `${service.title} en Haute-Savoie`,
    service.seoDescription || `${service.title} pour particuliers et professionnels en Haute-Savoie (74), à proximité de Genève.`,
    { path: `/services/${slug}`, image: service.imageUrl ?? undefined }
  );
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await safeDbQuery(
    () =>
      prisma.service.findUnique({
        where: { slug },
        include: {
          projects: {
            where: { isPublished: true },
            orderBy: [{ position: "asc" }, { createdAt: "desc" }],
            take: 3,
            select: { id: true, title: true, slug: true, city: true },
          },
        },
      }),
    null
  );
  if (!service || !service.isPublished) notFound();
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${base}/services` },
      { "@type": "ListItem", position: 3, name: service.title, item: `${base}/services/${service.slug}` },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    serviceType: service.title,
    areaServed: "Haute-Savoie (74), proximité Genève",
    image: service.imageUrl || undefined,
    url: `${base}/services/${service.slug}`,
  };

  return (
    <article className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{service.title}</h1>
          <p className="text-zinc-700">{service.description}</p>
          <a
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            className="cta-amber inline-flex rounded border px-4 py-2 font-semibold transition"
          >
            Demander un devis pour ce service
          </a>
        </div>
        <div>
          {service.imageUrl ? (
            <div className="relative mx-auto aspect-[16/11] max-w-xl overflow-hidden rounded-xl border bg-zinc-100">
              <Image
                src={service.imageUrl}
                alt={service.title}
                fill
                sizes="(max-width: 1024px) 92vw, 520px"
                quality={74}
                className="pointer-events-none select-none object-cover"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed bg-zinc-50 p-8 text-center text-sm text-zinc-500">
              Image du service à renseigner dans l&apos;admin.
            </div>
          )}
        </div>
      </div>

      {service.projects.length > 0 ? (
        <section className="rounded-xl border bg-white p-4">
          <h2 className="text-xl font-semibold">Chantiers liés à ce service</h2>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {service.projects.map((project) => (
              <a key={project.id} href={`/realisations/${project.slug}`} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 transition hover:border-zinc-300">
                <p className="font-semibold">{project.title}</p>
                <p className="text-sm text-zinc-600">{project.city || "Haute-Savoie"}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-zinc-900">
        <h2 className="text-xl font-semibold">Besoin de ce type d&apos;intervention ?</h2>
        <p className="mt-2 text-sm text-zinc-700">
          Envoyez quelques informations sur votre chantier : ville, dimensions, état actuel et délai souhaité.
        </p>
        <a
          href={`/contact?service=${encodeURIComponent(service.title)}`}
          className="mt-4 inline-flex rounded-lg bg-zinc-950 px-4 py-2 font-semibold text-white"
        >
          Obtenir un devis
        </a>
      </section>

      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      </div>
    </article>
  );
}

