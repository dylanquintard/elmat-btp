import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminProjectSchema } from "@/lib/admin-validations";
import { toSlug } from "@/lib/slug";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = adminProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const current = await prisma.project.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const baseSlug = toSlug(parsed.data.title);
  let slug = baseSlug;
  let i = 1;

  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing || existing.id === id) break;
    slug = `${baseSlug}-${i}`;
    i += 1;
  }

  const updated = await prisma.project.update({
    where: { id },
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
      images: {
        deleteMany: {},
        create: (parsed.data.images ?? []).map((img, index) => ({
          url: img.url,
          alt: img.alt || null,
          type: img.type,
          position: Number.isInteger(img.position) ? img.position : index,
        })),
      },
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
