import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminBlogArticleSchema } from "@/lib/admin-validations";
import { toSlug } from "@/lib/slug";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = adminBlogArticleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const current = await prisma.blogArticle.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ message: "Not found" }, { status: 404 });

  const newBaseSlug = toSlug(parsed.data.title);
  let slug = newBaseSlug;
  let i = 1;

  while (true) {
    const existing = await prisma.blogArticle.findUnique({ where: { slug } });
    if (!existing || existing.id === id) break;
    slug = `${newBaseSlug}-${i}`;
    i += 1;
  }

  const updated = await prisma.blogArticle.update({
    where: { id },
    data: {
      slug,
      title: parsed.data.title,
      intro: parsed.data.intro,
      isPublished: parsed.data.isPublished,
      position: parsed.data.position,
      seoTitle: parsed.data.seoTitle?.trim() || parsed.data.title,
      seoDescription: parsed.data.seoDescription?.trim() || parsed.data.intro,
      blocks: {
        deleteMany: {},
        create: parsed.data.blocks.map((block, index) => ({
          content: block.content,
          imageUrl: block.imageUrl || null,
          position: Number.isInteger(block.position) ? block.position : index,
        })),
      },
    },
    include: { blocks: { orderBy: { position: "asc" } } },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.blogArticle.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
