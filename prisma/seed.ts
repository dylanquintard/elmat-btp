import { PrismaClient, ProjectImageType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL et ADMIN_PASSWORD sont requis.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: "Administrateur",
    },
  });

  const settings = await prisma.siteSetting.findFirst();
  if (!settings) {
    await prisma.siteSetting.create({
      data: {
        companyName: "ELMAT",
        slogan: "Entreprise generale du batiment",
        description:
          "ELMAT intervient en maconnerie, renovation et demolition pour vos chantiers en Haute-Savoie, en proximite de Geneve cote France.",
        phone: "+33 4 50 00 00 00",
        email: "contact@elmat.fr",
        city: "Valleiry",
        country: "France",
        seoTitle: "ELMAT - Entreprise generale du batiment",
        seoDescription:
          "ELMAT, entreprise generale du batiment : maconnerie, renovation et demolition en Haute-Savoie, proximite Geneve cote France.",
      },
    });
  }

  const defaultAreas = [
    { city: "Haute-Savoie", slug: "haute-savoie", country: "France" },
    { city: "Valleiry", slug: "valleiry", country: "France" },
    { city: "Viry", slug: "viry", country: "France" },
    { city: "Saint-Julien-en-Genevois", slug: "saint-julien-en-genevois", country: "France" },
    { city: "Vers", slug: "vers", country: "France" },
    { city: "Cruseilles", slug: "cruseilles", country: "France" },
    { city: "Annemasse", slug: "annemasse", country: "France" },
    { city: "Annecy", slug: "annecy", country: "France" },
    { city: "Valserhone", slug: "valserhone", country: "France" },
    { city: "Gex", slug: "gex", country: "France" },
    { city: "Divonne-les-Bains", slug: "divonne-les-bains", country: "France" },
    { city: "Frangy", slug: "frangy", country: "France" },
    { city: "La Roche-sur-Foron", slug: "la-roche-sur-foron", country: "France" },
    { city: "Neydens", slug: "neydens", country: "France" },
  ];

  for (const area of defaultAreas) {
    await prisma.serviceArea.upsert({
      where: { slug: area.slug },
      update: {},
      create: {
        ...area,
        description: `Intervention possible sur le secteur de ${area.city}.`,
        seoTitle: `Entreprise BTP a ${area.city}`,
        seoDescription: `Entreprise du batiment intervenant a ${area.city} et alentours pour vos projets de travaux.`,
      },
    });
  }

  const servicesData = [
    {
      title: "Maconnerie generale",
      slug: "maconnerie-generale",
      shortDescription: "Construction, reprise, reparation et modification d'ouvrages maconnes.",
      description:
        "Construction, reprise, reparation et modification d'ouvrages maconnes : murs, murets, ouvertures, seuils, appuis, escaliers et petits travaux de gros oeuvre.",
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
      position: 1,
    },
    {
      title: "Renovation interieure et exterieure",
      slug: "renovation-interieure-exterieure",
      shortDescription: "Travaux de renovation pour ameliorer, transformer ou remettre en etat un batiment.",
      description:
        "Travaux de renovation pour ameliorer, transformer ou remettre en etat un batiment, une maison, un local ou une dependance.",
      imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      position: 2,
    },
    {
      title: "Demolition",
      slug: "demolition",
      shortDescription: "Demolition partielle, ouverture de murs et preparation de chantier.",
      description:
        "Demolition partielle, ouverture de murs, depose d'elements existants et preparation de chantier dans le respect des contraintes du batiment.",
      imageUrl: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80",
      position: 3,
    },
    {
      title: "Dalle beton et chape",
      slug: "dalle-beton-et-chape",
      shortDescription: "Realisation de dalles beton et chapes pour supports propres et stables.",
      description:
        "Realisation de dalles beton, chapes, supports propres et stables pour terrasses, garages, extensions, sols interieurs ou exterieurs.",
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
      position: 4,
    },
    {
      title: "Murs et soutenements",
      slug: "murs-et-soutenements",
      shortDescription: "Montage de murs en parpaings, murets, clotures et soutenements.",
      description:
        "Montage de murs en parpaings, murs en blocs creux, murets, murs de cloture et murs de soutenement en beton.",
      imageUrl: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
      position: 5,
    },
    {
      title: "Travaux techniques",
      slug: "travaux-techniques",
      shortDescription: "Carottage, resine, recherche de fuite, enduits, escaliers et interventions specifiques.",
      description:
        "Carottage, resine de sol, recherche de fuite, enduits, creation d'escaliers et interventions specifiques selon les besoins du chantier.",
      imageUrl: "https://images.unsplash.com/photo-1517581177682-a085bb7ffb15?auto=format&fit=crop&w=1200&q=80",
      position: 6,
    },
  ];

  const services = [] as Array<{ id: string; slug: string }>;
  for (const service of servicesData) {
    const s = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: service.title,
        shortDescription: service.shortDescription,
        description: service.description,
        imageUrl: service.imageUrl,
        position: service.position,
        isPublished: true,
      },
      create: {
        ...service,
        isPublished: true,
        seoTitle: `${service.title} en Haute-Savoie`,
        seoDescription: `${service.title} pour particuliers et professionnels en Haute-Savoie, proximite Geneve cote France.`,
      },
    });
    services.push({ id: s.id, slug: s.slug });
  }

  const testimonialsData = [
    { clientName: "Famille Martin", city: "Annecy", rating: 5, message: "Equipe serieuse, chantier propre et delais respectes." },
    { clientName: "M. Renaud", city: "Annemasse", rating: 5, message: "Tres bon suivi du debut a la fin. Resultat impeccable." },
    { clientName: "SCI Les Cedres", city: "Saint-Julien-en-Genevois", rating: 4, message: "Intervention efficace et communication tres professionnelle." },
    { clientName: "Mme Perret", city: "Thonon-les-Bains", rating: 5, message: "Travaux de renovation reussis, equipe a l'ecoute." },
    { clientName: "M. Falcoz", city: "Bonneville", rating: 5, message: "Tres satisfait du rapport qualite/prix et des finitions." },
    { clientName: "Cabinet Alta", city: "Archamps", rating: 4, message: "Bon partenaire pour nos projets d'amenagement exterieur." },
  ];

  let pos = 1;
  for (const t of testimonialsData) {
    await prisma.testimonial.upsert({
      where: { id: `${t.clientName}-${t.city}`.replace(/\s+/g, "-").toLowerCase() },
      update: {
        clientName: t.clientName,
        city: t.city,
        rating: t.rating,
        message: t.message,
        isPublished: true,
        position: pos,
      },
      create: {
        id: `${t.clientName}-${t.city}`.replace(/\s+/g, "-").toLowerCase(),
        clientName: t.clientName,
        city: t.city,
        country: "France",
        rating: t.rating,
        message: t.message,
        isPublished: true,
        position: pos,
      },
    });
    pos += 1;
  }

  const projectData = [
    {
      title: "Chantier Annecy - Renovation complete salon",
      slug: "chantier-annecy-renovation-salon",
      city: "Annecy",
      description: "Renovation complete d'un salon avec reprise des murs, isolation et finitions haut de gamme.",
      problem: "Pieces vieillissantes avec defauts d'isolation et murs abimes.",
      solution: "Reprise structurelle legere, isolation, finitions peintures et eclairage modernise.",
      serviceSlug: "renovation-interieure",
      images: [
        { type: ProjectImageType.BEFORE, url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", alt: "Salon avant travaux" },
        { type: ProjectImageType.AFTER, url: "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=1200&q=80", alt: "Salon apres renovation" },
      ],
    },
    {
      title: "Chantier Annemasse - Reprise maconnerie facade",
      slug: "chantier-annemasse-reprise-maconnerie-facade",
      city: "Annemasse",
      description: "Reprise de fissures facade et consolidation maconnerie avec traitement durable.",
      problem: "Fissures actives et humidite sur facade exposee.",
      solution: "Purge, reprise des joints et traitement hydrofuge complet.",
      serviceSlug: "maconnerie-generale",
      images: [
        { type: ProjectImageType.BEFORE, url: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80", alt: "Facade avant reprise" },
        { type: ProjectImageType.AFTER, url: "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80", alt: "Facade apres reprise" },
      ],
    },
    {
      title: "Chantier Saint-Julien-en-Genevois - Terrasse exterieure",
      slug: "chantier-saint-julien-en-genevois-terrasse-exterieure",
      city: "Saint-Julien-en-Genevois",
      description: "Creation d'une terrasse exterieure avec dalle beton, finition et acces jardin.",
      problem: "Exterieur difficilement exploitable et sol instable.",
      solution: "Preparation du support, dalle armee et finition antiderapante.",
      serviceSlug: "amenagement-exterieur",
      images: [
        { type: ProjectImageType.BEFORE, url: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80", alt: "Exterieur avant amenagement" },
        { type: ProjectImageType.AFTER, url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80", alt: "Terrasse apres travaux" },
      ],
    },
    {
      title: "Chantier Thonon - Dalle beton garage",
      slug: "chantier-thonon-dalle-beton-garage",
      city: "Thonon-les-Bains",
      description: "Realisation d'une dalle beton pour garage avec preparation de fondations.",
      problem: "Sol en pente et impossibilite de stationnement stable.",
      solution: "Terrassement, coffrage, ferraillage et coulage d'une dalle armee.",
      serviceSlug: "dalle-beton-fondations",
      images: [
        { type: ProjectImageType.BEFORE, url: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=80", alt: "Terrain avant dalle" },
        { type: ProjectImageType.AFTER, url: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&w=1200&q=80", alt: "Dalle beton finalisee" },
      ],
    },
  ];

  let projectPos = 1;
  for (const p of projectData) {
    const service = services.find((s) => s.slug === p.serviceSlug);

    const project = await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        city: p.city,
        country: "France",
        description: p.description,
        problem: p.problem,
        solution: p.solution,
        serviceId: service?.id,
        isPublished: true,
        position: projectPos,
      },
      create: {
        title: p.title,
        slug: p.slug,
        city: p.city,
        country: "France",
        duration: "4 a 8 semaines",
        description: p.description,
        problem: p.problem,
        solution: p.solution,
        serviceId: service?.id,
        isPublished: true,
        position: projectPos,
        seoTitle: `${p.title} - Realisation BTP`,
        seoDescription: `Decouvrez la realisation ${p.title} et ses photos avant/apres.`,
      },
    });

    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });

    let imagePos = 1;
    for (const img of p.images) {
      await prisma.projectImage.create({
        data: {
          projectId: project.id,
          url: img.url,
          alt: img.alt,
          type: img.type,
          position: imagePos,
        },
      });
      imagePos += 1;
    }

    projectPos += 1;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
