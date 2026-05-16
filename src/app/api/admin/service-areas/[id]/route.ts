import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminServiceAreaSchema } from "@/lib/admin-validations";
import { toSlug } from "@/lib/slug";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = adminServiceAreaSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const current = await prisma.serviceArea.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const newBaseSlug = toSlug(parsed.data.city);
  let slug = newBaseSlug;
  let i = 1;

  while (true) {
    const existing = await prisma.serviceArea.findUnique({ where: { slug } });
    if (!existing || existing.id === id) break;
    slug = `${newBaseSlug}-${i}`;
    i += 1;
  }

  const updated = await prisma.serviceArea.update({
    where: { id },
    data: {
      ...parsed.data,
      slug,
      country: parsed.data.country || null,
      description: parsed.data.description || null,
      seoTitle: parsed.data.seoTitle || null,
      seoDescription: parsed.data.seoDescription || null,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.serviceArea.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
