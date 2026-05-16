export const revalidate = 300;
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getLocalBusinessJsonLd } from "@/lib/seo";
import { HomeGallery } from "@/components/public/HomeGallery";
import { ScrollProgress } from "@/components/public/ScrollProgress";
import { RevealSection } from "@/components/public/RevealSection";

export default async function HomePage() {
  const [settings, services, projects, testimonials, zones, galleryItems] = await Promise.all([
    prisma.siteSetting.findFirst(),
    prisma.service.findMany({ where: { isPublished: true }, orderBy: { position: "asc" }, take: 6 }),
    prisma.project.findMany({ where: { isPublished: true }, orderBy: { position: "asc" }, take: 3 }),
    prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { position: "asc" }, take: 6 }),
    prisma.serviceArea.findMany({ where: { isPublished: true }, orderBy: { city: "asc" }, take: 12 }),
    prisma.galleryItem.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 24,
      select: { id: true, title: true, imageUrl: true },
    }),
  ]);

  const jsonLd = await getLocalBusinessJsonLd();
  const rawHeroImageUrl =
    settings?.heroImageUrl?.trim() ||
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1920&q=80";
  const heroImageUrl = (() => {
    if (!rawHeroImageUrl) return rawHeroImageUrl;
    // Keep Next/Image strict remote config while still supporting local absolute URLs.
    if (rawHeroImageUrl.startsWith("http://localhost:3000/uploads/")) {
      return rawHeroImageUrl.replace("http://localhost:3000", "");
    }
    if (rawHeroImageUrl.startsWith("http://127.0.0.1:3000/uploads/")) {
      return rawHeroImageUrl.replace("http://127.0.0.1:3000", "");
    }
    return rawHeroImageUrl;
  })();
  const mainServices = [
    {
      title: "Maconnerie generale",
      text: "Construction, reprise, reparation et modification d’ouvrages maconnes : murs, murets, ouvertures, seuils, appuis, escaliers et petits travaux de gros oeuvre.",
    },
    {
      title: "Renovation interieure et exterieure",
      text: "Travaux de renovation pour ameliorer, transformer ou remettre en etat un batiment, une maison, un local ou une dependance.",
    },
    {
      title: "Demolition",
      text: "Demolition partielle, ouverture de murs, depose d’elements existants et preparation de chantier dans le respect des contraintes du batiment.",
    },
    {
      title: "Dalle beton et chape",
      text: "Realisation de dalles beton, chapes, supports propres et stables pour terrasses, garages, extensions, sols interieurs ou exterieurs.",
    },
    {
      title: "Murs et soutenements",
      text: "Montage de murs en parpaings, murs en blocs creux, murets, murs de cloture et murs de soutenement en beton.",
    },
    {
      title: "Travaux techniques",
      text: "Carottage, resine de sol, recherche de fuite, enduits, creation d’escaliers et interventions specifiques selon les besoins du chantier.",
    },
  ];
  const technicalTags = [
    "Maconnerie generale",
    "Renovation interieure",
    "Renovation exterieure",
    "Demolition",
    "Carottage beton",
    "Resine de sol",
    "Chape beton",
    "Dalle beton",
    "Mur en parpaings",
    "Mur de soutenement",
    "Creation d’ouvertures",
    "Enduit",
    "Escaliers beton",
    "Recherche de fuite",
    "Travaux de reprise et reparation",
  ];
  const faqItems = [
    {
      q: "Quels types de travaux de maconnerie realisez-vous ?",
      a: "Nous realisons des travaux de maconnerie generale, renovation interieure et exterieure, demolition, dalle beton, chape, murs en parpaings, murs de soutenement, creation d’ouvertures, carottage, enduits, escaliers et resine de sol.",
    },
    {
      q: "Realisez-vous des petits travaux de maconnerie ?",
      a: "Oui, nous intervenons aussi pour des petits travaux comme une reprise de mur, une ouverture, un seuil, une reparation, une chape ou un enduit.",
    },
    {
      q: "Pouvez-vous intervenir pour une renovation complete ?",
      a: "Oui, nous pouvons accompagner des projets de renovation interieure ou exterieure selon l’etat du batiment et les travaux necessaires.",
    },
    {
      q: "Faites-vous des devis gratuits ?",
      a: "Oui, un devis est etabli apres echange sur votre projet et, si necessaire, apres visite du chantier.",
    },
    {
      q: "Intervenez-vous autour de Geneve et en Haute-Savoie ?",
      a: "Oui, nous intervenons en Haute-Savoie et en proximite de Geneve cote France. Pas d’intervention en Suisse pour le moment.",
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
      <ScrollProgress />
      <div className="pointer-events-none fixed -left-20 top-24 z-0 h-72 w-72 rounded-full bg-amber-300/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none fixed -right-24 bottom-24 z-0 h-80 w-80 rounded-full bg-zinc-700/20 blur-3xl animate-pulse" />

      <RevealSection
        className="relative overflow-hidden rounded-2xl bg-zinc-900 p-8 text-zinc-100"
      >
        <Image
          src={heroImageUrl}
          alt={`Chantier ${settings?.companyName ?? "Entreprise BTP"}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/65" />
        <p className="relative z-10 mb-2 text-sm text-amber-400">Haute-Savoie et proximite Geneve (France)</p>
        <h1 className="relative z-10 text-4xl font-bold">{settings?.companyName ?? "Entreprise BTP en Haute-Savoie"}</h1>
        <p className="relative z-10 mt-3 max-w-3xl text-zinc-200">{settings?.description ?? "Construction, renovation et amenagement pour particuliers et professionnels."}</p>
        <div className="relative z-10 mt-6 flex gap-3">
          <Link href="/contact" className="rounded bg-amber-500 px-4 py-2 font-semibold text-zinc-900">Demander un devis</Link>
          <Link href="/realisations" className="rounded border border-zinc-600 px-4 py-2">Voir nos realisations</Link>
        </div>
      </RevealSection>

      <RevealSection delay={0.04}>
        <h2 className="mb-3 text-2xl font-semibold">
          Votre macon de confiance pour vos travaux de renovation et de gros oeuvre
        </h2>
        <p className="max-w-4xl text-zinc-700">
          Que ce soit pour un projet de renovation, une creation d’ouverture, une dalle beton, un mur en parpaings, une demolition ou des travaux de finition, nous mettons notre savoir-faire au service de vos besoins.
          <br />
          <br />
          Chaque chantier est etudie avec attention afin de proposer une solution solide, propre et durable. Nous intervenons aussi bien sur des petits travaux que sur des projets plus complets de renovation interieure ou exterieure.
        </p>
      </RevealSection>

      <RevealSection delay={0.06}>
        <h2 className="mb-4 text-2xl font-semibold">Nos principaux services</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mainServices.map((service) => (
            <article key={service.title} className="rounded-xl border border-zinc-300 bg-white p-4">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{service.text}</p>
            </article>
          ))}
        </div>
        {services.length > 0 ? (
          <div className="mt-4">
            <Link href="/services" className="text-sm font-semibold text-amber-700 underline">
              Voir le detail de tous nos services
            </Link>
          </div>
        ) : null}
      </RevealSection>

      <RevealSection delay={0.08}>
        <h2 className="mb-3 text-2xl font-semibold">Des prestations adaptees a chaque chantier</h2>
        <p className="max-w-4xl text-zinc-700">
          En complement des travaux de maconnerie traditionnelle, nous realisons egalement des interventions plus ciblees : carottage beton, creation d’ouvertures, pose de resine, realisation d’enduits, reprise de sols, recherche de fuite, escaliers, chapes et travaux de renovation sur mesure.
          <br />
          <br />
          L’objectif est simple : proposer une solution fiable, propre et adaptee aux contraintes de votre batiment.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {technicalTags.map((tag) => (
            <span key={tag} className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-700">
              {tag}
            </span>
          ))}
        </div>
      </RevealSection>

      <RevealSection delay={0.1}>
        <h2 className="mb-4 text-2xl font-semibold">Un accompagnement serieux, du devis a la finition</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-zinc-300 bg-white p-4">
            <h3 className="font-semibold">Devis clair et personnalise</h3>
            <p className="mt-2 text-sm text-zinc-600">Chaque projet est etudie selon vos besoins, votre budget et les contraintes du chantier.</p>
          </article>
          <article className="rounded-xl border border-zinc-300 bg-white p-4">
            <h3 className="font-semibold">Travail propre et durable</h3>
            <p className="mt-2 text-sm text-zinc-600">Les travaux sont realises avec soin pour garantir un resultat solide et propre dans le temps.</p>
          </article>
          <article className="rounded-xl border border-zinc-300 bg-white p-4">
            <h3 className="font-semibold">Polyvalence chantier</h3>
            <p className="mt-2 text-sm text-zinc-600">Maconnerie, renovation, demolition, beton, resine, enduit ou ouverture : un seul interlocuteur pour plusieurs besoins.</p>
          </article>
          <article className="rounded-xl border border-zinc-300 bg-white p-4">
            <h3 className="font-semibold">Conseils adaptes</h3>
            <p className="mt-2 text-sm text-zinc-600">Nous vous orientons vers les solutions les plus coherentes selon l’etat du batiment et l’objectif des travaux.</p>
          </article>
        </div>
      </RevealSection>

      <RevealSection delay={0.12}>
        <h2 className="mb-3 text-2xl font-semibold">Nos realisations en maconnerie et renovation</h2>
        <p className="mb-4 max-w-4xl text-zinc-700">
          Decouvrez quelques exemples de chantiers realises : renovation, dalle beton, murs, ouvertures, demolition, resine de sol ou travaux exterieurs. Chaque realisation reflete notre exigence de qualite et notre attention aux details.
        </p>
        <HomeGallery items={galleryItems} />
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/realisations/${p.slug}`}
              className="group relative rounded-xl border border-zinc-300 bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:border-zinc-400 hover:shadow-[0_12px_26px_rgba(0,0,0,0.14)]"
            >
              <h3 className="font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-zinc-600">{p.description.slice(0, 120)}...</p>
              <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wide text-amber-700 opacity-0 transition duration-300 group-hover:opacity-100">
                Voir le chantier
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/realisations" className="text-sm font-semibold text-amber-700 underline">
            Voir plus des chantiers
          </Link>
        </div>
      </RevealSection>

      <RevealSection delay={0.14}>
        <h2 className="mb-3 text-2xl font-semibold">Intervention en Haute-Savoie et proximite Geneve (cote France)</h2>
        <p className="max-w-4xl text-zinc-700">
          Nous intervenons pour vos travaux de maconnerie, renovation et demolition en Haute-Savoie, notamment a Valleiry, Viry, Saint-Julien-en-Genevois, Vers, Cruseilles, Annemasse, Annecy, Valserhone, Gex, Divonne-les-Bains, Frangy, La Roche-sur-Foron et Neydens. Pour toute demande de devis, contactez-nous afin d’echanger sur votre projet et verifier la faisabilite de l’intervention.
        </p>
        <p className="mt-3 max-w-4xl text-zinc-700">
          Proximite Geneve, mais pas d’intervention en Suisse pour le moment.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {zones.map((z) => (
            <span key={z.id} className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm">
              {z.city}
            </span>
          ))}
        </div>
      </RevealSection>

      <RevealSection delay={0.16}>
        <h2 className="mb-4 text-2xl font-semibold">Comment se deroule votre projet ?</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-xl border border-zinc-300 bg-white p-4">
            <h3 className="font-semibold">1. Prise de contact</h3>
            <p className="mt-2 text-sm text-zinc-600">Vous nous expliquez votre besoin : renovation, demolition, dalle, chape, mur, ouverture ou autre intervention.</p>
          </article>
          <article className="rounded-xl border border-zinc-300 bg-white p-4">
            <h3 className="font-semibold">2. Etude du chantier</h3>
            <p className="mt-2 text-sm text-zinc-600">Nous analysons les contraintes techniques, l’acces, les materiaux et les finitions souhaitees.</p>
          </article>
          <article className="rounded-xl border border-zinc-300 bg-white p-4">
            <h3 className="font-semibold">3. Devis personnalise</h3>
            <p className="mt-2 text-sm text-zinc-600">Vous recevez une proposition claire, adaptee a votre projet.</p>
          </article>
          <article className="rounded-xl border border-zinc-300 bg-white p-4">
            <h3 className="font-semibold">4. Realisation des travaux</h3>
            <p className="mt-2 text-sm text-zinc-600">Les travaux sont realises avec serieux, proprete et suivi jusqu’a la finition.</p>
          </article>
        </div>
      </RevealSection>

      <RevealSection delay={0.18}>
        <h2 className="mb-4 text-2xl font-semibold">FAQ</h2>
        <div className="space-y-3">
          <details className="rounded-xl border border-zinc-300 bg-white p-4">
            <summary className="cursor-pointer font-semibold">Quels types de travaux de maconnerie realisez-vous ?</summary>
            <p className="mt-2 text-sm text-zinc-700">Nous realisons des travaux de maconnerie generale, renovation interieure et exterieure, demolition, dalle beton, chape, murs en parpaings, murs de soutenement, creation d’ouvertures, carottage, enduits, escaliers et resine de sol.</p>
          </details>
          <details className="rounded-xl border border-zinc-300 bg-white p-4">
            <summary className="cursor-pointer font-semibold">Realisez-vous des petits travaux de maconnerie ?</summary>
            <p className="mt-2 text-sm text-zinc-700">Oui, nous pouvons intervenir pour des petits travaux comme une reprise de mur, une ouverture, un seuil, une reparation, une chape, un enduit ou une modification d’ouvrage existant.</p>
          </details>
          <details className="rounded-xl border border-zinc-300 bg-white p-4">
            <summary className="cursor-pointer font-semibold">Pouvez-vous intervenir pour une renovation complete ?</summary>
            <p className="mt-2 text-sm text-zinc-700">Oui, nous pouvons accompagner des projets de renovation interieure ou exterieure, selon l’etat du batiment et les travaux necessaires.</p>
          </details>
          <details className="rounded-xl border border-zinc-300 bg-white p-4">
            <summary className="cursor-pointer font-semibold">Faites-vous des devis gratuits ?</summary>
            <p className="mt-2 text-sm text-zinc-700">Oui, un devis peut etre realise apres echange sur votre projet et, si necessaire, apres visite du chantier.</p>
          </details>
          <details className="rounded-xl border border-zinc-300 bg-white p-4">
            <summary className="cursor-pointer font-semibold">Intervenez-vous autour de Geneve et en Haute-Savoie ?</summary>
            <p className="mt-2 text-sm text-zinc-700">Oui, nous intervenons en Haute-Savoie et en proximite de Geneve cote France. Pas d’intervention en Suisse pour le moment.</p>
          </details>
        </div>
      </RevealSection>

      <RevealSection delay={0.2}>
        <h2 className="mb-4 text-2xl font-semibold">Avis clients</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-xl border border-zinc-300 bg-white p-4">
              <p className="text-sm text-zinc-700">&quot;{t.message}&quot;</p>
              <p className="mt-2 text-sm font-semibold">{t.clientName}</p>
            </div>
          ))}
        </div>
      </RevealSection>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </div>
  );
}







