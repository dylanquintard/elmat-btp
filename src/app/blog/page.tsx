export const revalidate = 600;
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDefaultMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return getDefaultMetadata(
    "Blog maconnerie et renovation en Haute-Savoie",
    "Conseils, methodes chantier et retours terrain sur la maconnerie, la renovation et les travaux techniques en Haute-Savoie."
  );
}

export default async function BlogPage() {
  const articles = await prisma.blogArticle.findMany({
    where: { isPublished: true },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    include: { _count: { select: { blocks: true } } },
  });

  return (
    <div className="space-y-6">
      <header className="relative overflow-hidden rounded-2xl bg-zinc-900 p-7 text-zinc-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.2),transparent_35%)]" />
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="mt-2 text-zinc-300">Des articles pratiques pour mieux comprendre les travaux de maconnerie et renovation.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <article key={article.id} className="rounded-xl border bg-white p-4">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="mt-2 text-zinc-700">{article.intro}</p>
            <p className="mt-2 text-xs text-zinc-500">{article._count.blocks} paragraphe(s)</p>
            <Link href={`/blog/${article.slug}`} className="mt-3 inline-flex rounded bg-amber-500 px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-amber-400">
              Lire l'article
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
