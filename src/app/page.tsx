export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma, safeDbQuery } from "@/lib/prisma";
import { getLocalBusinessJsonLd, getNapData } from "@/lib/seo";
import { HomeGallery } from "@/components/public/HomeGallery";
import { RevealSection } from "@/components/public/RevealSection";

function toTelHref(value?: string | null) {
  const cleaned = (value ?? "").replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "tel:+33000000000";
}

export default async function HomePage() {
  const [settings, nap, projects, testimonials, zones, galleryItems] = await Promise.all([
    safeDbQuery(() => prisma.siteSetting.findFirst(), null),
    getNapData(),
    safeDbQuery(() => prisma.project.findMany({ where: { isPublished: true }, orderBy: { position: "asc" }, take: 3 }), []),
    safeDbQuery(() => prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { position: "asc" }, take: 6 }), []),
    safeDbQuery(() => prisma.serviceArea.findMany({ where: { isPublished: true }, orderBy: { city: "asc" }, take: 12 }), []),
    safeDbQuery(
      () =>
        prisma.galleryItem.findMany({
          where: { isPublished: true },
          orderBy: { createdAt: "desc" },
          take: 24,
          select: { id: true, title: true, imageUrl: true },
        }),
      []
    ),
  ]);

  const jsonLd = await getLocalBusinessJsonLd();
  const rawHeroImageUrl =
    settings?.heroImageUrl?.trim() ||
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80";
  const heroImageUrl = rawHeroImageUrl
    .replace("http://localhost:3000/uploads/", "/uploads/")
    .replace("http://127.0.0.1:3000/uploads/", "/uploads/");
  const phoneHref = toTelHref(nap.phone);

  const mainServices = [
    {
      title: "Maçonnerie générale",
      text: "Construction, reprise et réparation d'ouvrages maçonnés : murs, murets, ouvertures, seuils, appuis, escaliers et petits travaux de gros oeuvre.",
    },
    {
      title: "Rénovation intérieure et extérieure",
      text: "Remise en état, transformation et amélioration de maisons, locaux, dépendances et espaces extérieurs.",
    },
    {
      title: "Démolition et préparation",
      text: "Démolition partielle, ouverture de murs, dépose d'éléments existants et préparation de chantier.",
    },
    {
      title: "Dalle béton et chape",
      text: "Supports propres et stables pour terrasses, garages, extensions, sols intérieurs ou extérieurs.",
    },
    {
      title: "Murs et soutènements",
      text: "Montage de murs en parpaings, murets, murs de clôture et murs de soutènement en béton.",
    },
    {
      title: "Travaux techniques",
      text: "Carottage, résine de sol, enduits, recherche de fuite, escaliers béton et interventions spécifiques.",
    },
  ];

  const faqItems = [
    {
      q: "Quels travaux réalise ELMAT ?",
      a: "ELMAT intervient en maçonnerie générale, rénovation intérieure et extérieure, démolition, dalle béton, chape, murs en parpaings, murs de soutènement, carottage, enduits et travaux techniques.",
    },
    {
      q: "Intervenez-vous pour des petits travaux ?",
      a: "Oui. Une reprise de mur, une ouverture, un seuil, une réparation, une chape ou un enduit peuvent faire l'objet d'une demande de devis.",
    },
    {
      q: "Le devis est-il gratuit ?",
      a: "Oui. Un devis est établi après échange sur le projet et, si nécessaire, après visite du chantier.",
    },
    {
      q: "Dans quelles zones intervenez-vous ?",
      a: "ELMAT intervient en Haute-Savoie (74), notamment autour de Valleiry, Saint-Julien-en-Genevois, Annemasse, Annecy et à proximité de Genève.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="relative space-y-12 overflow-x-clip">
      <RevealSection className="relative min-h-[580px] overflow-hidden rounded-2xl bg-zinc-950 text-zinc-100">
        <Image
          src={heroImageUrl}
          alt={`Chantier de maçonnerie réalisé par ${nap.companyName}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/62 to-black/20" />
        <div className="relative z-10 flex min-h-[580px] max-w-4xl flex-col justify-center px-6 py-10 md:px-10">
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-300">
            Maçonnerie, rénovation et démolition en Haute-Savoie
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
            {settings?.companyName ?? "ELMAT"}, l&apos;entreprise BTP qui transforme vos projets en réalités durables.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-200">
            Un professionnel réactif pour vos dalles béton, murs, ouvertures, rénovations et reprises de maçonnerie en Haute-Savoie autour de Valleiry, Saint-Julien-en-Genevois, Annemasse, Annecy et Genève.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/contact" className="rounded-lg bg-amber-500 px-5 py-3 text-center font-semibold text-zinc-950 transition hover:bg-amber-400">
              Demander un devis gratuit
            </Link>
            <a href={phoneHref} className="rounded-lg border border-white/50 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10">
              Appeler {nap.phone}
            </a>
          </div>
          <div className="mt-8 grid max-w-3xl gap-3 text-sm text-zinc-200 sm:grid-cols-3">
            <p className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">Devis clair après étude du besoin</p>
            <p className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">Travail soigné, propre et durable</p>
            <p className="rounded-lg border border-white/15 bg-white/10 p-3 backdrop-blur">Intervention locale en Haute-Savoie</p>
          </div>
        </div>
      </RevealSection>

      <RevealSection delay={0.04} className="grid gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-zinc-300 bg-white p-5">
          <p className="text-sm font-semibold text-amber-700">01</p>
          <h2 className="mt-1 text-xl font-semibold">Vous expliquez le chantier</h2>
          <p className="mt-2 text-sm text-zinc-700">Surface, ville, délai, photos éventuelles et contraintes d&apos;accès : nous qualifions rapidement votre demande.</p>
        </article>
        <article className="rounded-xl border border-zinc-300 bg-white p-5">
          <p className="text-sm font-semibold text-amber-700">02</p>
          <h2 className="mt-1 text-xl font-semibold">Nous cadrons la solution</h2>
          <p className="mt-2 text-sm text-zinc-700">Nous vérifions les points techniques, les matériaux, la faisabilité et la meilleure méthode d&apos;intervention.</p>
        </article>
        <article className="rounded-xl border border-zinc-300 bg-white p-5">
          <p className="text-sm font-semibold text-amber-700">03</p>
          <h2 className="mt-1 text-xl font-semibold">Vous recevez un devis</h2>
          <p className="mt-2 text-sm text-zinc-700">La proposition est claire, adaptée au chantier et pensée pour éviter les mauvaises surprises.</p>
        </article>
      </RevealSection>

      <RevealSection delay={0.06}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Travaux de maçonnerie et rénovation</h2>
            <p className="mt-2 max-w-3xl text-zinc-700">
              ELMAT accompagne les particuliers et professionnels pour des travaux solides, propres et adaptés au bâti existant.
            </p>
          </div>
          <Link href="/services" className="font-semibold text-amber-700 underline">
            Voir tous les services
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mainServices.map((service) => (
            <article key={service.title} className="rounded-xl border border-zinc-300 bg-white p-5">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-zinc-700">{service.text}</p>
            </article>
          ))}
        </div>
      </RevealSection>

      <RevealSection delay={0.08} className="rounded-2xl border border-amber-300 bg-amber-50 p-6 text-zinc-900">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Un projet à chiffrer ? Envoyez une demande aujourd&apos;hui.</h2>
            <p className="mt-2 max-w-3xl text-zinc-700">
              Décrivez votre besoin en quelques lignes. Pour un retour utile, indiquez la ville du chantier, le type de travaux, les dimensions approximatives et le délai souhaité.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
            <Link href="/contact" className="rounded-lg bg-zinc-950 px-5 py-3 text-center font-semibold text-white">
              Demander un devis
            </Link>
            <a href={phoneHref} className="rounded-lg border border-zinc-400 px-5 py-3 text-center font-semibold text-zinc-900">
              {nap.phone}
            </a>
          </div>
        </div>
      </RevealSection>

      <RevealSection delay={0.1}>
        <h2 className="text-3xl font-semibold">Réalisations récentes</h2>
        <p className="mt-2 max-w-4xl text-zinc-700">
          Quelques exemples de chantiers : rénovation, dalle béton, murs, ouvertures, démolition, résine de sol ou travaux extérieurs.
        </p>
        <div className="mt-5">
          <HomeGallery items={galleryItems} />
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/realisations/${p.slug}`}
              className="group rounded-xl border border-zinc-300 bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-[0_12px_26px_rgba(0,0,0,0.14)]"
            >
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-zinc-700">{p.description.slice(0, 130)}...</p>
              <span className="mt-3 inline-block text-sm font-semibold text-amber-700 underline">
                Voir le chantier
              </span>
            </Link>
          ))}
        </div>
      </RevealSection>

      <RevealSection delay={0.12} className="grid gap-6 lg:grid-cols-[1fr_0.75fr]">
        <section>
          <h2 className="text-3xl font-semibold">Intervention en Haute-Savoie, à proximité de Genève</h2>
          <p className="mt-3 max-w-4xl text-zinc-700">
            Nous intervenons notamment à Valleiry, Viry, Saint-Julien-en-Genevois, Vers, Cruseilles, Annemasse, Annecy, Valserhône, Gex, Divonne-les-Bains, Frangy, La Roche-sur-Foron et Neydens.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {zones.map((z) => (
              <span key={z.id} className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm">
                {z.city}
              </span>
            ))}
          </div>
        </section>
        <aside className="rounded-xl border border-zinc-300 bg-white p-5">
          <h3 className="text-xl font-semibold">Pourquoi choisir ELMAT ?</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-700">
            <li>Un contact direct avec l&apos;entreprise.</li>
            <li>Des explications claires avant intervention.</li>
            <li>Une approche adaptée aux petits travaux comme aux chantiers plus complets.</li>
            <li>Une présence locale en Haute-Savoie.</li>
          </ul>
        </aside>
      </RevealSection>

      {testimonials.length > 0 ? (
        <RevealSection delay={0.14}>
          <h2 className="text-3xl font-semibold">Avis clients</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.id} className="rounded-xl border border-zinc-300 bg-white p-5">
                <blockquote className="text-sm text-zinc-700">&quot;{t.message}&quot;</blockquote>
                <figcaption className="mt-3 text-sm font-semibold">
                  {t.clientName}
                  {t.city ? <span className="font-normal text-zinc-500"> - {t.city}</span> : null}
                </figcaption>
              </figure>
            ))}
          </div>
        </RevealSection>
      ) : null}

      <RevealSection delay={0.16}>
        <h2 className="text-3xl font-semibold">Questions fréquentes</h2>
        <div className="mt-5 space-y-3">
          {faqItems.map((item) => (
            <details key={item.q} className="rounded-xl border border-zinc-300 bg-white p-4">
              <summary className="cursor-pointer font-semibold">{item.q}</summary>
              <p className="mt-2 text-sm text-zinc-700">{item.a}</p>
            </details>
          ))}
        </div>
      </RevealSection>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}
