"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";

type GalleryItem = {
  id: string;
  title: string;
  imageUrl: string;
  isPublished: boolean;
  position: number;
};

type GalleryInput = Omit<GalleryItem, "id">;

const emptyForm: GalleryInput = {
  title: "",
  imageUrl: "",
  isPublished: true,
  position: 0,
};

export default function AdminGaleriePage() {
  const router = useRouter();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState<GalleryInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const actionLabel = useMemo(() => (editingId ? "Mettre a jour" : "Ajouter"), [editingId]);

  async function load() {
    const res = await fetch("/api/admin/gallery", { cache: "no-store" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) return;
    setItems(await res.json());
  }

  useEffect(() => {
    fetch("/api/admin/gallery", { cache: "no-store" })
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login?reason=session-expired");
          return null;
        }
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setItems(data);
      });
  }, [router]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Enregistrement...");

    const payload = {
      ...form,
      position: Number(form.position) || 0,
    };

    const url = editingId ? `/api/admin/gallery/${editingId}` : "/api/admin/gallery";
    const method = editingId ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) {
      setStatus("Erreur de sauvegarde");
      return;
    }

    setStatus(editingId ? "Photo mise a jour" : "Photo ajoutee");
    setForm(emptyForm);
    setEditingId(null);
    await load();
  }

  function startEdit(item: GalleryItem) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      imageUrl: item.imageUrl,
      isPublished: item.isPublished,
      position: item.position,
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette photo de la galerie ?")) return;
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) {
      setStatus("Erreur de suppression");
      return;
    }
    setStatus("Photo supprimee");
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Galerie (independante)</h1>
      <p className="text-sm text-zinc-600">Cette galerie est separee des fiches chantier et apparait sur la page d&apos;accueil.</p>

      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Titre photo" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required />
        <input className="rounded border p-2" placeholder="Position" type="number" value={form.position} onChange={(e) => setForm((s) => ({ ...s, position: Number(e.target.value) }))} />
        <label className="flex items-center gap-2 rounded border p-2 md:col-span-2">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((s) => ({ ...s, isPublished: e.target.checked }))} />
          Publie
        </label>
        <div className="md:col-span-2">
          <AdminImageUploadField label="Image de galerie" value={form.imageUrl} onChange={(url) => setForm((s) => ({ ...s, imageUrl: url }))} />
        </div>
        <div className="md:col-span-2">
          <button className="rounded bg-zinc-900 px-4 py-2 text-white" type="submit">{actionLabel}</button>
          {editingId ? <button type="button" className="ml-2 rounded border px-4 py-2" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Annuler</button> : null}
          {status ? <span className="ml-3 text-sm">{status}</span> : null}
        </div>
      </form>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border bg-white p-3">
            <div className="relative mb-2 aspect-[4/3] overflow-hidden rounded border bg-zinc-100">
              <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            </div>
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-zinc-600">pos {item.position} | {item.isPublished ? "publie" : "brouillon"}</p>
            <div className="mt-2 flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => startEdit(item)}>Editer</button>
              <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-700" onClick={() => remove(item.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
