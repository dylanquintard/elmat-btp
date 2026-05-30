export const revalidate = 600;
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDefaultMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.blogArticle.findUnique({ where: { slug } });

  if (!article) {
    return getDefaultMetadata("Article blog", "Article de blog BTP.", { path: `/blog/${slug}` });
  }

  return getDefaultMetadata(
    article.seoTitle || article.title,
    article.seoDescription || article.intro,
    { path: `/blog/${slug}` }
  );
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await prisma.blogArticle.findUnique({
    where: { slug },
    include: { blocks: { orderBy: { position: "asc" } } },
  });

  if (!article || !article.isPublished) notFound();

  return (
    <article className="space-y-6">
      <header className="rounded-2xl border bg-white p-5">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <p className="mt-3 text-zinc-700">{article.intro}</p>
      </header>

      <section className="space-y-6 rounded-2xl border bg-white p-5">
        {article.blocks.map((block) => (
          <div key={block.id} className="space-y-3">
            {block.imageUrl ? (
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border bg-zinc-100">
                <Image
                  src={block.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 1024px) 96vw, 960px"
                  className="pointer-events-none select-none object-cover"
                />
              </div>
            ) : null}
            <p className="whitespace-pre-line text-zinc-800">{block.content}</p>
          </div>
        ))}
      </section>
    </article>
  );
}
