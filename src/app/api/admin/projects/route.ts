import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminProjectSchema } from "@/lib/admin-validations";
import { toSlug } from "@/lib/slug";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    include: {
      service: { select: { id: true, title: true } },
      images: { orderBy: { position: "asc" } },
    },
  });

  const services = await prisma.service.findMany({
    where: { isPublished: true },
    select: { id: true, title: true },
    orderBy: { title: "asc" },
  });

  return NextResponse.json({ projects, services });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = adminProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const baseSlug = toSlug(parsed.data.title);
  let slug = baseSlug;
  let i = 1;

  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i}`;
    i += 1;
  }

  const project = await prisma.project.create({
    data: {
      slug,
      title: parsed.data.title,
      description: parsed.data.description,
      isPublished: parsed.data.isPublished,
      position: parsed.data.position,
      city: parsed.data.city || null,
      country: parsed.data.country || null,
      duration: parsed.data.duration || null,
      problem: parsed.data.problem || null,
      solution: parsed.data.solution || null,
      detailedDescription: parsed.data.detailedDescription || null,
      serviceId: parsed.data.serviceId || null,
      seoTitle: parsed.data.seoTitle?.trim() || parsed.data.title,
      seoDescription: parsed.data.seoDescription?.trim() || parsed.data.description,
      images: parsed.data.images?.length
        ? {
            create: parsed.data.images.map((img, index) => ({
              url: img.url,
              alt: img.alt || null,
              type: img.type,
              position: Number.isInteger(img.position) ? img.position : index,
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
