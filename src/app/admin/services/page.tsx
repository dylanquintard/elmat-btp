"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";

type Service = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  imageUrl?: string | null;
  isPublished: boolean;
  position: number;
};

type ServiceInput = Omit<Service, "id" | "slug">;

const emptyForm: ServiceInput = {
  title: "",
  shortDescription: "",
  description: "",
  imageUrl: "",
  isPublished: true,
  position: 0,
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState<ServiceInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const actionLabel = useMemo(() => (editingId ? "Mettre a jour" : "Creer"), [editingId]);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/admin/services", { cache: "no-store" });
      if (!res.ok) return;
      setItems(await res.json());
    })();
  }, []);

  async function load() {
    const res = await fetch("/api/admin/services", { cache: "no-store" });
    if (!res.ok) return;
    setItems(await res.json());
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Enregistrement...");

    const payload = { ...form, position: Number(form.position) || 0 };
    const url = editingId ? `/api/admin/services/${editingId}` : "/api/admin/services";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setStatus("Erreur de sauvegarde");
      return;
    }

    setStatus(editingId ? "Service mis a jour" : "Service cree");
    setForm(emptyForm);
    setEditingId(null);
    await load();
  }

  function startEdit(s: Service) {
    setEditingId(s.id);
    setForm({
      title: s.title,
      shortDescription: s.shortDescription,
      description: s.description,
      imageUrl: s.imageUrl ?? "",
      isPublished: s.isPublished,
      position: s.position,
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer ce service ?")) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Services</h1>

      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Titre" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required />
        <input className="rounded border p-2" placeholder="Position" type="number" value={form.position} onChange={(e) => setForm((s) => ({ ...s, position: Number(e.target.value) }))} />
        <input className="rounded border p-2 md:col-span-2" placeholder="Description courte" value={form.shortDescription} onChange={(e) => setForm((s) => ({ ...s, shortDescription: e.target.value }))} required />
        <textarea className="rounded border p-2 md:col-span-2" placeholder="Description longue" rows={5} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} required />
        <div className="md:col-span-2">
          <AdminImageUploadField
            label="Image du service"
            value={form.imageUrl ?? ""}
            onChange={(url) => setForm((s) => ({ ...s, imageUrl: url }))}
          />
        </div>
        <label className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((s) => ({ ...s, isPublished: e.target.checked }))} />
          Publie
        </label>
        <div className="md:col-span-2">
          <button className="rounded bg-zinc-900 px-4 py-2 text-white" type="submit">{actionLabel}</button>
          {editingId ? <button type="button" className="ml-2 rounded border px-4 py-2" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Annuler</button> : null}
          {status ? <span className="ml-3 text-sm">{status}</span> : null}
        </div>
      </form>

      <div className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="flex items-start justify-between rounded-lg border bg-white p-3">
            <div>
              <p className="font-semibold">{s.title} <span className="text-xs text-zinc-500">/{s.slug}</span></p>
              <p className="text-sm text-zinc-600">{s.shortDescription}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => startEdit(s)}>Editer</button>
              <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-700" onClick={() => remove(s.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
