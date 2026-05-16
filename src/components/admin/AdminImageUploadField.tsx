"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

type AdminImageUploadFieldProps = {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
  disabled?: boolean;
  uploadKind?: "default" | "logo";
};

export function AdminImageUploadField({ label, value, onChange, disabled, uploadKind = "default" }: AdminImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatus("Upload...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("kind", uploadKind);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      setStatus("Echec upload");
      setLoading(false);
      return;
    }

    const data = await res.json();
    onChange(data.url);
    setStatus("Image telechargee");
    setLoading(false);
  }

  return (
    <div className="space-y-2 rounded border border-zinc-200 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">{label}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded border px-2 py-1 text-xs"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || loading}
          >
            {loading ? "Envoi..." : "Uploader"}
          </button>
          {value ? (
            <button
              type="button"
              className="rounded border border-red-300 px-2 py-1 text-xs text-red-700"
              onClick={() => onChange("")}
              disabled={disabled || loading}
            >
              Supprimer
            </button>
          ) : null}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={onFileChange}
        disabled={disabled || loading}
      />

      {value ? (
        <div className="relative aspect-[16/10] overflow-hidden rounded border bg-zinc-100">
          <Image src={value} alt={label} fill sizes="(max-width: 768px) 100vw, 480px" className="object-cover" />
        </div>
      ) : (
        <p className="text-xs text-zinc-500">Aucune image</p>
      )}

      {status ? <p className="text-xs text-zinc-600">{status}</p> : null}
      {value ? <p className="truncate text-xs text-zinc-500">{value}</p> : null}
    </div>
  );
}
