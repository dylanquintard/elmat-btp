"use client";

import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
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
        className={`relative cursor-ew-resize overflow-hidden rounded-xl border border-zinc-300 bg-zinc-200 touch-none ${compact ? "mx-auto w-[98%] aspect-[16/9.8] md:w-[96%] md:aspect-[16/9.2]" : "aspect-[16/10.4]"}`}
      >
        <Image
          src={afterUrl}
          alt={afterLabel ?? "Photo apres travaux"}
          fill
          sizes={compact ? "(max-width: 768px) 98vw, 1120px" : "(max-width: 768px) 96vw, 920px"}
          quality={72}
          className="object-cover"
          draggable={false}
        />
        <Image
          src={beforeUrl}
          alt={beforeLabel ?? "Photo avant travaux"}
          fill
          sizes={compact ? "(max-width: 768px) 98vw, 1120px" : "(max-width: 768px) 96vw, 920px"}
          quality={72}
          className="object-cover"
          style={{ clipPath }}
          draggable={false}
        />

        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${value}%` }}>
          <div className="relative h-full w-[3px] -translate-x-1/2 bg-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.65)]">
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-amber-300 bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_8px_22px_rgba(245,158,11,0.5)]">
              <ChevronsLeftRight className="h-6 w-6 text-zinc-950" strokeWidth={2.75} aria-hidden="true" />
            </div>
          </div>
        </div>

        <span className="absolute left-3 top-3 rounded bg-zinc-900/75 px-2 py-1 text-xs font-semibold text-white">Avant</span>
        <span className="absolute right-3 top-3 rounded bg-amber-500/90 px-2 py-1 text-xs font-semibold text-zinc-900">Apres</span>
      </div>

      {!compact ? (
        <>
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
        </>
      ) : null}

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
