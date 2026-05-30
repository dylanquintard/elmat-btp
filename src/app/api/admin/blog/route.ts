import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminBlogArticleSchema } from "@/lib/admin-validations";
import { toSlug } from "@/lib/slug";

export async function GET() {
  const articles = await prisma.blogArticle.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    include: { blocks: { orderBy: { position: "asc" } } },
  });
  return NextResponse.json(articles);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = adminBlogArticleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const baseSlug = toSlug(parsed.data.title);
  let slug = baseSlug;
  let i = 1;

  while (await prisma.blogArticle.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i}`;
    i += 1;
  }

  const article = await prisma.blogArticle.create({
    data: {
      slug,
      title: parsed.data.title,
      intro: parsed.data.intro,
      isPublished: parsed.data.isPublished,
      position: parsed.data.position,
      seoTitle: parsed.data.seoTitle?.trim() || parsed.data.title,
      seoDescription: parsed.data.seoDescription?.trim() || parsed.data.intro,
      blocks: {
        create: parsed.data.blocks.map((block, index) => ({
          content: block.content,
          imageUrl: block.imageUrl || null,
          position: Number.isInteger(block.position) ? block.position : index,
        })),
      },
    },
    include: { blocks: { orderBy: { position: "asc" } } },
  });

  return NextResponse.json(article, { status: 201 });
}
