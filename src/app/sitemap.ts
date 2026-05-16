export const dynamic = "force-dynamic";
import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [services, projects] = await Promise.all([
    prisma.service.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.project.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
  ]);

  return [
    "",
    "/services",
    "/realisations",
    "/contact",
    "/mentions-legales",
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }))
    .concat(services.map((s) => ({ url: `${base}/services/${s.slug}`, lastModified: s.updatedAt })))
    .concat(projects.map((p) => ({ url: `${base}/realisations/${p.slug}`, lastModified: p.updatedAt })));
}

