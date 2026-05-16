"use client";

import Link from "next/link";
import Image from "next/image";

type ServiceCard = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  imageUrl: string | null;
};

type ServicesDynamicGridProps = {
  services: ServiceCard[];
};

export function ServicesDynamicGrid({ services }: ServicesDynamicGridProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {services.map((s) => {
        return (
          <article
            key={s.id}
            className="group relative overflow-hidden rounded-2xl border border-zinc-300 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
          >
            {s.imageUrl ? (
              <>
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <Image
                    src={s.imageUrl}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-zinc-900/0 transition duration-500 group-hover:bg-zinc-900/65" />
              </>
            ) : null}

            <div className="relative z-10">
              <h2 className="text-xl font-bold transition group-hover:text-white">{s.title}</h2>
              <p className="mt-2 text-sm text-zinc-700 transition group-hover:text-zinc-100">{s.shortDescription}</p>
              <Link
                href={`/services/${s.slug}`}
                className="mt-4 inline-block rounded-full border border-amber-500 px-4 py-2 text-sm font-semibold text-amber-700 transition group-hover:border-white group-hover:bg-white group-hover:text-zinc-900"
              >
                Voir details
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
