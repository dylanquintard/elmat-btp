"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

type BeforeAfterSliderProps = {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  compact?: boolean;
  showLegend?: boolean;
};

export function BeforeAfterSlider({
  beforeUrl,
  afterUrl,
  beforeLabel,
  afterLabel,
  compact = false,
  showLegend = true,
}: BeforeAfterSliderProps) {
  const [value, setValue] = useState(50);
  const sliderId = useId();
  const frameRef = useRef<HTMLDivElement | null>(null);

  const clipPath = `inset(0 ${100 - value}% 0 0)`;

  function setFromClientX(clientX: number) {
    const frame = frameRef.current;
    if (!frame) return;

    const rect = frame.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const next = Math.max(0, Math.min(100, Math.round(ratio * 100)));
    setValue(next);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.buttons === 0) return;
    setFromClientX(e.clientX);
  }

  return (
    <div className="space-y-3">
      <div
        ref={frameRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        className={`relative cursor-ew-resize overflow-hidden rounded-xl border border-zinc-300 bg-zinc-200 touch-none ${compact ? "mx-auto w-[88%] aspect-[16/10] md:w-[82%] md:aspect-[16/9.6]" : "aspect-[16/10]"}`}
      >
        <Image
          src={afterUrl}
          alt={afterLabel ?? "Photo apres travaux"}
          fill
          sizes="(max-width: 768px) 100vw, 920px"
          className="object-cover"
          draggable={false}
        />
        <Image
          src={beforeUrl}
          alt={beforeLabel ?? "Photo avant travaux"}
          fill
          sizes="(max-width: 768px) 100vw, 920px"
          className="object-cover"
          style={{ clipPath }}
          draggable={false}
        />

        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${value}%` }}>
          <div className="relative h-full w-[2px] -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)]">
            <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-zinc-900/70 text-white">
              <span className="text-xs">??</span>
            </div>
          </div>
        </div>

        <span className="absolute left-3 top-3 rounded bg-zinc-900/75 px-2 py-1 text-xs font-semibold text-white">Avant</span>
        <span className="absolute right-3 top-3 rounded bg-amber-500/90 px-2 py-1 text-xs font-semibold text-zinc-900">Apres</span>
      </div>

      <label htmlFor={sliderId} className="sr-only">Balayage avant apres</label>
      <input
        id={sliderId}
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-amber-500"
      />

      {showLegend ? (
        <div className="grid gap-2 text-sm text-zinc-700 md:grid-cols-2">
          <p className="rounded border border-zinc-200 bg-white p-2">
            <strong>Avant:</strong> {beforeLabel ?? "Etat initial du chantier"}
          </p>
          <p className="rounded border border-zinc-200 bg-white p-2">
            <strong>Apres:</strong> {afterLabel ?? "Resultat apres intervention"}
          </p>
        </div>
      ) : null}
    </div>
  );
}
