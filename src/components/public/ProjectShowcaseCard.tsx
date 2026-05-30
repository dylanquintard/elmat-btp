"use client";

import Link from "next/link";
import { BeforeAfterSlider } from "@/components/public/BeforeAfterSlider";

type ProjectShowcaseCardProps = {
  slug: string;
  title: string;
  summary: string;
  city?: string | null;
  duration?: string | null;
  beforeUrl?: string;
  afterUrl?: string;
  beforeLabel?: string;
  afterLabel?: string;
};

export function ProjectShowcaseCard({
  slug,
  title,
  summary,
  city,
  duration,
  beforeUrl,
  afterUrl,
  beforeLabel,
  afterLabel,
}: ProjectShowcaseCardProps) {
  return (
    <article className="project-card-surface relative overflow-hidden rounded-2xl border border-zinc-700/20 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.10)] md:p-5">
      <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-amber-300/25 blur-2xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-zinc-700/10 blur-2xl" />

      <div className="relative flex flex-wrap items-center justify-center gap-2 text-center">
        <h2 className="project-card-title text-2xl font-black tracking-tight text-zinc-900 md:text-[1.75rem]">{title}</h2>
        {city ? <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs text-zinc-700">{city}</span> : null}
        {duration ? <span className="rounded-full border border-zinc-300 px-2 py-0.5 text-xs text-zinc-700">{duration}</span> : null}
      </div>
      <p className="relative mx-auto mt-2 max-w-3xl text-center text-sm text-zinc-700">{summary}</p>

      {beforeUrl && afterUrl ? (
        <div className="relative mx-auto mt-3 max-w-4xl">
          <BeforeAfterSlider
            beforeUrl={beforeUrl}
            afterUrl={afterUrl}
            beforeLabel={beforeLabel}
            afterLabel={afterLabel}
            compact
            showLegend={false}
          />
        </div>
      ) : (
        <p className="relative mt-4 rounded border border-dashed border-zinc-300 bg-zinc-50 p-4 text-sm text-zinc-600">
          Photos avant/apres a renseigner pour ce chantier.
        </p>
      )}

      <div className="relative mt-4 flex justify-center">
        <Link
          href={`/realisations/${slug}`}
          className="inline-flex rounded bg-amber-500 px-4 py-2 font-semibold text-zinc-900 transition hover:bg-amber-400"
        >
          Voir plus d&apos;infos chantier
        </Link>
      </div>
    </article>
  );
}
