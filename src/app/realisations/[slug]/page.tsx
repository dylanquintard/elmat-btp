export const revalidate = 300;
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BeforeAfterSlider } from "@/components/public/BeforeAfterSlider";
import { getDefaultMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });

  if (!project) {
    return getDefaultMetadata("Realisation BTP", "Exemple de chantier de maconnerie et renovation en Haute-Savoie.", {
      path: `/realisations/${slug}`,
    });
  }

  return getDefaultMetadata(
    project.seoTitle || `${project.title} - Realisation BTP`,
    project.seoDescription || `Decouvrez cette realisation de chantier en Haute-Savoie (74), a proximite de Geneve.`,
    { path: `/realisations/${slug}` }
  );
}

function getFirstByType(
  images: Array<{ id: string; url: string; alt: string | null; type: "BEFORE" | "AFTER" | "DURING" | "GENERAL" }>,
  type: "BEFORE" | "AFTER"
) {
  return images.find((img) => img.type === type) ?? images.find((img) => img.type === "GENERAL") ?? images[0];
}

export default async function RealisationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      service: { select: { title: true, slug: true } },
    },
  });

  if (!project || !project.isPublished) notFound();

  const before = getFirstByType(project.images, "BEFORE");
  const after = getFirstByType(project.images, "AFTER");
  const galleryImages = project.images.filter((img) => img.id !== before?.id && img.id !== after?.id);
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${base}/` },
      { "@type": "ListItem", position: 2, name: "Nos chantiers", item: `${base}/realisations` },
      { "@type": "ListItem", position: 3, name: project.title, item: `${base}/realisations/${project.slug}` },
    ],
  };

  const creativeWorkJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    about: project.service?.title || "Chantier BTP",
    contentLocation: project.city || "Haute-Savoie",
    image: project.images.map((img) => img.url),
    url: `${base}/realisations/${project.slug}`,
  };

  const imageObjectsJsonLd = project.images.slice(0, 12).map((img) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: img.url,
    caption: img.alt || project.title,
  }));

  return (
    <article className="space-y-5">
      <section className="grid gap-4 rounded-2xl border border-zinc-200 bg-white p-4 md:grid-cols-[1.2fr_1fr] md:p-5">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold md:text-4xl">{project.title}</h1>
          {project.service ? (
            <p className="text-sm text-zinc-600">
              Service associe:{" "}
              <Link href={`/services/${project.service.slug}`} className="font-semibold text-amber-700 underline">
                {project.service.title}
              </Link>
            </p>
          ) : null}
          {before && after ? (
            <BeforeAfterSlider
              beforeUrl={before.url}
              afterUrl={after.url}
              beforeLabel={before.alt ?? project.problem ?? "Etat avant travaux"}
              afterLabel={after.alt ?? project.solution ?? "Resultat final apres travaux"}
            />
          ) : (
            <p className="rounded border border-dashed border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-600">
              Photos avant/apres non disponibles pour ce chantier.
            </p>
          )}
        </div>

        <aside className="space-y-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 md:p-4">
          <h2 className="text-xl font-bold md:text-2xl">Details chantier</h2>
          <p className="text-sm text-zinc-700 md:text-base">{project.description}</p>
          <div className="grid gap-2 text-sm">
            <p className="rounded-lg border border-zinc-200 bg-white px-3 py-2"><strong>Lieu:</strong> {project.city ?? "Non renseigne"}</p>
            <p className="rounded-lg border border-zinc-200 bg-white px-3 py-2"><strong>Duree:</strong> {project.duration ?? "Non renseignee"}</p>
            <p className="rounded-lg border border-zinc-200 bg-white px-3 py-2"><strong>Probleme initial:</strong> {project.problem ?? "Non renseigne"}</p>
            <p className="rounded-lg border border-zinc-200 bg-white px-3 py-2"><strong>Solution:</strong> {project.solution ?? "Non renseignee"}</p>
          </div>
        </aside>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-4 md:p-5">
        <h2 className="text-xl font-bold md:text-2xl">Ce qui a ete realise</h2>
        <p className="mt-2 whitespace-pre-line text-zinc-700">
          {project.detailedDescription?.trim() || project.solution?.trim() || "Description detaillee a venir."}
        </p>
      </section>

      {galleryImages.length > 0 ? (
        <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-4 md:p-5">
          <h2 className="text-xl font-bold md:text-2xl">Galerie du chantier</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {galleryImages.map((img) => (
              <figure key={img.id} className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50">
                <div className="relative aspect-[16/11]">
                  <Image
                    src={img.url}
                    alt={img.alt ?? project.title}
                    fill
                    sizes="(max-width: 768px) 48vw, (max-width: 1280px) 30vw, 360px"
                    quality={72}
                    className="object-cover"
                  />
                </div>
                {img.alt ? <figcaption className="line-clamp-2 p-2 text-xs text-zinc-600">{img.alt}</figcaption> : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      <Link href={`/contact?chantier=${encodeURIComponent(project.title)}`} className="inline-block rounded bg-amber-500 px-4 py-2 font-semibold text-zinc-900 transition hover:bg-amber-400">
        Demander un devis pour un chantier similaire
      </Link>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }} />
      {imageObjectsJsonLd.map((imgJsonLd, index) => (
        <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(imgJsonLd) }} />
      ))}
    </article>
  );
}
