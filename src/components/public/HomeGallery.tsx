"use client";

import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type GalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
};

type HomeGalleryProps = {
  items: GalleryItem[];
};

export function HomeGallery({ items }: HomeGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeItem = useMemo(() => {
    if (activeIndex === null) return null;
    return items[activeIndex] ?? null;
  }, [activeIndex, items]);

  const openAt = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const close = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || items.length === 0) return current;
      return (current - 1 + items.length) % items.length;
    });
  }, [items.length]);

  const goNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || items.length === 0) return current;
      return (current + 1) % items.length;
    });
  }, [items.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, goNext, goPrev]);

  if (items.length === 0) return null;

  const main = items[0];
  const sideItems = items.slice(1, 5);
  const hiddenCount = Math.max(items.length - 5, 0);
  const activeDisplayIndex = activeIndex === null ? 0 : activeIndex + 1;

  return (
    <section className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-white shadow-[0_20px_60px_rgba(0,0,0,0.22)] md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl font-semibold text-white">Galerie</h2>
          <p className="mt-1 text-sm text-zinc-300">Quelques realisations ELMAT en Haute-Savoie.</p>
        </div>
        <span className="rounded-full border border-amber-300/45 bg-amber-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-zinc-950">
          {items.length} photo{items.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.45fr_1fr]">
        <GalleryTile item={main} index={0} priority size="large" onOpen={openAt} />

        <div className="grid grid-cols-2 gap-3">
          {sideItems.map((item, index) => {
            const itemIndex = index + 1;
            const showMore = hiddenCount > 0 && itemIndex === 4;

            return (
              <GalleryTile
                key={item.id}
                item={item}
                index={itemIndex}
                size="small"
                moreLabel={showMore ? `+${hiddenCount} photos` : undefined}
                onOpen={openAt}
              />
            );
          })}
        </div>
      </div>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[120] bg-black/85 p-3 backdrop-blur-sm sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-label="Galerie photo"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="mx-auto flex h-full max-w-6xl flex-col">
            <div className="mb-3 flex shrink-0 items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950/95 px-3 py-2 text-white shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold md:text-base">{activeItem.title}</p>
                <p className="text-xs text-zinc-300">
                  Photo {activeDisplayIndex} sur {items.length}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:border-amber-300 hover:bg-amber-400 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                aria-label="Fermer la galerie"
                title="Fermer"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
              <Image
                src={activeItem.imageUrl}
                alt={activeItem.title}
                fill
                sizes="100vw"
                className="select-none object-contain"
                priority
              />

              {items.length > 1 ? (
                <>
                  <ModalNavButton direction="prev" onClick={goPrev} />
                  <ModalNavButton direction="next" onClick={goNext} />
                </>
              ) : null}
            </div>

            {items.length > 1 ? (
              <div className="mt-3 flex shrink-0 gap-2 overflow-x-auto pb-1">
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openAt(index)}
                    className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:h-20 sm:w-32 ${
                      index === activeIndex
                        ? "border-amber-300 ring-2 ring-amber-300/55"
                        : "border-white/15 opacity-75 hover:border-white/45 hover:opacity-100"
                    }`}
                    aria-label={`Afficher la photo: ${item.title}`}
                  >
                    <Image src={item.imageUrl} alt="" fill sizes="128px" className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function GalleryTile({
  item,
  index,
  priority = false,
  size,
  moreLabel,
  onOpen,
}: {
  item: GalleryItem;
  index: number;
  priority?: boolean;
  size: "large" | "small";
  moreLabel?: string;
  onOpen: (index: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-zinc-900 text-left transition duration-300 hover:-translate-y-0.5 hover:border-amber-300/70 hover:shadow-[0_16px_34px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
      aria-label={`Ouvrir la photo: ${item.title}`}
    >
      <div className={`relative ${size === "large" ? "aspect-[4/3] sm:aspect-[16/10]" : "aspect-[4/3]"}`}>
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          sizes={size === "large" ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 50vw, 22vw"}
          className="pointer-events-none select-none object-cover transition duration-500 group-hover:scale-[1.035]"
          priority={priority}
        />
      </div>

      <span className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-1 rounded-full border border-white/20 bg-zinc-950/80 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white transition group-hover:border-amber-300 group-hover:bg-amber-400 group-hover:text-zinc-950">
        <Maximize2 className="size-3.5" aria-hidden="true" />
        Voir
      </span>

      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-3 pb-3 pt-12">
        <span className="block truncate text-sm font-semibold text-white">{moreLabel ?? item.title}</span>
      </span>
    </button>
  );
}

function ModalNavButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isPrev = direction === "prev";
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  const label = isPrev ? "Photo precedente" : "Photo suivante";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute top-1/2 inline-flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-zinc-950/80 text-white shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition hover:border-amber-300 hover:bg-amber-400 hover:text-zinc-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 sm:size-14 ${
        isPrev ? "left-2 sm:left-4" : "right-2 sm:right-4"
      }`}
      aria-label={label}
      title={label}
    >
      <Icon className="size-6" aria-hidden="true" />
    </button>
  );
}
