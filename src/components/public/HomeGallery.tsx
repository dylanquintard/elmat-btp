"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type GalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type HomeGalleryProps = {
  items: GalleryItem[];
};

export function HomeGallery({ items }: HomeGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const openAt = useCallback((index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, goNext, goPrev, isOpen]);

  if (items.length === 0) return null;

  const main = items[0];
  const second = items[1];
  const third = items[2];
  const moreCount = Math.max(items.length - 3, 0);

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-4 md:p-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Galerie</h2>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-[1.8fr_1fr]">
        <button
          type="button"
          onClick={() => openAt(0)}
          className="group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          aria-label={`Ouvrir la photo: ${main.title}`}
        >
          <div className="relative aspect-[5/4] md:aspect-[16/11]">
            <Image src={main.imageUrl} alt={main.title} fill sizes="(max-width: 768px) 100vw, 66vw" className="pointer-events-none select-none object-cover transition duration-500 group-hover:scale-[1.03]" />
          </div>
          <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white opacity-100 transition duration-300 md:opacity-0 md:group-hover:opacity-100">Ouvrir</span>
          <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2 text-sm font-semibold text-white">
            {main.title}
          </span>
        </button>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-1">
          {second ? (
            <button
              type="button"
              onClick={() => openAt(1)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label={`Ouvrir la photo: ${second.title}`}
            >
              <div className="relative aspect-[5/4] md:aspect-[16/11]">
                <Image src={second.imageUrl} alt={second.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="pointer-events-none select-none object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <span className="pointer-events-none absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-semibold text-white opacity-100 transition duration-300 md:opacity-0 md:group-hover:opacity-100">Ouvrir</span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1 text-xs font-medium text-white">
                {second.title}
              </span>
            </button>
          ) : null}

          {third ? (
            <button
              type="button"
              onClick={() => openAt(2)}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-zinc-200 text-left transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label={`Ouvrir la photo: ${third.title}`}
            >
              <div className="relative aspect-[5/4] md:aspect-[16/11]">
                <Image src={third.imageUrl} alt={third.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="pointer-events-none select-none object-cover transition duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black/35">
                <span className="rounded-full border border-white/70 bg-black/35 px-3 py-1 text-xs font-semibold text-white">
                  {moreCount > 0 ? `+${moreCount} photos` : "Galerie"}
                </span>
              </div>
            </button>
          ) : null}
        </div>
      </div>

      {isOpen ? (
        <div className="fixed inset-0 z-50 bg-black/90 p-3 md:p-6" role="dialog" aria-modal="true" aria-label="Galerie photo">
          <div className="absolute inset-0" onClick={close} aria-hidden="true" />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-center">
            <button
              type="button"
              onClick={close}
              className="absolute right-0 top-0 z-20 rounded-full border border-white/35 bg-black/45 p-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              aria-label="Fermer la galerie"
            >
              X
            </button>
            <div className="relative mx-auto w-full overflow-hidden rounded-2xl border border-white/25 bg-black shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <div className="relative aspect-[5/4] max-h-[68vh] w-full md:aspect-[16/11]">
                <Image
                  src={items[activeIndex].imageUrl}
                  alt={items[activeIndex].title}
                  fill
                  sizes="100vw"
                  className="pointer-events-none select-none object-cover"
                  priority
                />
              </div>

              <button
                type="button"
                onClick={goPrev}
                className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/45 p-3 text-sm font-semibold text-white transition hover:bg-black/70 md:block"
                aria-label="Photo precedente"
              >
                ←
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/45 p-3 text-sm font-semibold text-white transition hover:bg-black/70 md:block"
                aria-label="Photo suivante"
              >
                →
              </button>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-4 pb-4 pt-12">
                <p className="truncate text-center text-sm font-semibold text-white md:text-base">{items[activeIndex].title}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2 text-white md:hidden">
              <button
                type="button"
                onClick={goPrev}
                className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
                aria-label="Photo precedente"
              >
                Precedent
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg border border-white/30 bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20"
                aria-label="Photo suivante"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
