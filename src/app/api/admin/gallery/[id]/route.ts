import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGalleryItemSchema } from "@/lib/admin-validations";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = adminGalleryItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.galleryItem.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const updated = await prisma.galleryItem.update({
    where: { id },
    data: {
      title: parsed.data.title,
      imageUrl: parsed.data.imageUrl,
      description: null,
      city: null,
      isPublished: parsed.data.isPublished,
      position: parsed.data.position,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
