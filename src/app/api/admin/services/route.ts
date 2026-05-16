import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminServiceSchema } from "@/lib/admin-validations";
import { toSlug } from "@/lib/slug";

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: [{ position: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = adminServiceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const baseSlug = toSlug(parsed.data.title);
  let slug = baseSlug;
  let i = 1;

  while (await prisma.service.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i}`;
    i += 1;
  }

  const service = await prisma.service.create({
    data: {
      slug,
      title: parsed.data.title,
      shortDescription: parsed.data.shortDescription,
      description: parsed.data.description,
      isPublished: parsed.data.isPublished,
      position: parsed.data.position,
      imageUrl: parsed.data.imageUrl || null,
      seoTitle: parsed.data.seoTitle?.trim() || parsed.data.title,
      seoDescription: parsed.data.seoDescription?.trim() || parsed.data.shortDescription,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
