import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminGalleryItemSchema } from "@/lib/admin-validations";

export async function GET() {
  const items = await prisma.galleryItem.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = adminGalleryItemSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const item = await prisma.galleryItem.create({
    data: {
      title: parsed.data.title,
      imageUrl: parsed.data.imageUrl,
      description: null,
      city: null,
      isPublished: parsed.data.isPublished,
      position: parsed.data.position,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
