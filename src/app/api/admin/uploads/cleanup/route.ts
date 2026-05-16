import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUploadDir } from "@/lib/upload-path";

function normalizeUploadUrl(url: string | null | undefined) {
  if (!url) return null;
  if (!url.startsWith("/uploads/")) return null;
  return url;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const apply = Boolean(body?.apply);

  const uploadDir = getUploadDir();
  const files = await readdir(uploadDir).catch(() => [] as string[]);

  const [serviceImages, projectImages, galleryImages, logoHero] = await Promise.all([
    prisma.service.findMany({ select: { imageUrl: true } }),
    prisma.projectImage.findMany({ select: { url: true } }),
    prisma.galleryItem.findMany({ select: { imageUrl: true } }),
    prisma.siteSetting.findMany({ select: { logoUrl: true, heroImageUrl: true } }),
  ]);

  const referenced = new Set<string>();

  for (const s of serviceImages) {
    const url = normalizeUploadUrl(s.imageUrl);
    if (url) referenced.add(url.replace("/uploads/", ""));
  }

  for (const p of projectImages) {
    const url = normalizeUploadUrl(p.url);
    if (url) referenced.add(url.replace("/uploads/", ""));
  }

  for (const g of galleryImages) {
    const url = normalizeUploadUrl(g.imageUrl);
    if (url) referenced.add(url.replace("/uploads/", ""));
  }

  for (const st of logoHero) {
    const logo = normalizeUploadUrl(st.logoUrl);
    const hero = normalizeUploadUrl(st.heroImageUrl);
    if (logo) referenced.add(logo.replace("/uploads/", ""));
    if (hero) referenced.add(hero.replace("/uploads/", ""));
  }

  const orphanFiles = files.filter((f) => !referenced.has(f));

  const deleted: string[] = [];
  if (apply && orphanFiles.length > 0) {
    for (const file of orphanFiles) {
      await rm(path.join(uploadDir, file), { force: true });
      deleted.push(file);
    }
  }

  return NextResponse.json({
    totalFiles: files.length,
    referencedFiles: referenced.size,
    orphanFiles,
    deletedFiles: deleted,
    dryRun: !apply,
  });
}
