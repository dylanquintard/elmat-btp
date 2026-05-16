export const revalidate = 600;
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getDefaultMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({ where: { slug } });

  if (!service) {
    return getDefaultMetadata("Service BTP", "Details d'un service de maconnerie et renovation en Haute-Savoie.", {
      path: `/services/${slug}`,
    });
  }

  return getDefaultMetadata(
    service.seoTitle || `${service.title} en Haute-Savoie`,
    service.seoDescription || `${service.title} pour particuliers et professionnels en Haute-Savoie, proximite Geneve cote France.`,
    { path: `/services/${slug}`, image: service.imageUrl ?? undefined }
  );
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await prisma.service.findUnique({
    where: { slug },
    include: {
      projects: {
        where: { isPublished: true },
        orderBy: [{ position: "asc" }, { createdAt: "desc" }],
        take: 3,
        select: { id: true, title: true, slug: true, city: true },
      },
    },
  });
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
    areaServed: "Haute-Savoie, proximite Geneve cote France",
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
            className="inline-flex rounded bg-amber-500 px-4 py-2 font-semibold text-zinc-900 transition hover:bg-amber-400"
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
              Image du service a renseigner dans l&apos;admin.
            </div>
          )}
        </div>
      </div>

      {service.projects.length > 0 ? (
        <section className="rounded-xl border bg-white p-4">
          <h2 className="text-xl font-semibold">Chantiers lies a ce service</h2>
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

      <div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      </div>
    </article>
  );
}

