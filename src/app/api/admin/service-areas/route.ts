import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminServiceAreaSchema } from "@/lib/admin-validations";
import { toSlug } from "@/lib/slug";

export async function GET() {
  const areas = await prisma.serviceArea.findMany({ orderBy: [{ city: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(areas);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = adminServiceAreaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const baseSlug = toSlug(parsed.data.city);
  let slug = baseSlug;
  let i = 1;

  while (await prisma.serviceArea.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i}`;
    i += 1;
  }

  const area = await prisma.serviceArea.create({
    data: {
      ...parsed.data,
      slug,
      country: parsed.data.country || null,
      description: parsed.data.description || null,
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
    },
  });

  return NextResponse.json(area, { status: 201 });
}
