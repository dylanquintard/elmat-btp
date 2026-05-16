import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (email && password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.adminUser.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        name: "Administrateur",
      },
      create: {
        email,
        password: hashedPassword,
        name: "Administrateur",
      },
    });
    console.log(`[bootstrap] Admin synchronise: ${email}`);
  } else {
    console.warn("[bootstrap] ADMIN_EMAIL/ADMIN_PASSWORD absents: admin non initialise.");
  }

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
    console.log("[bootstrap] Parametres site crees.");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("[bootstrap] Erreur:", error);
    await prisma.$disconnect();
    process.exit(1);
  });

