"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ServiceArea = {
  id: string;
  city: string;
  slug: string;
  country?: string | null;
  description?: string | null;
  isPublished: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

type ServiceAreaInput = Omit<ServiceArea, "id" | "slug">;

const emptyForm: ServiceAreaInput = {
  city: "",
  country: "",
  description: "",
  isPublished: true,
  seoTitle: "",
  seoDescription: "",
};

export default function AdminServiceAreasPage() {
  const router = useRouter();
  const [items, setItems] = useState<ServiceArea[]>([]);
  const [form, setForm] = useState<ServiceAreaInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const actionLabel = useMemo(() => (editingId ? "Mettre a jour" : "Creer"), [editingId]);

  async function load() {
    const res = await fetch("/api/admin/service-areas", { cache: "no-store" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) return;
    setItems(await res.json());
  }

  useEffect(() => {
    fetch("/api/admin/service-areas", { cache: "no-store" })
      .then((res) => {
        if (res.status === 401) {
          router.push("/admin/login?reason=session-expired");
          return null;
        }
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        if (data) setItems(data);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Enregistrement...");

    const url = editingId ? `/api/admin/service-areas/${editingId}` : "/api/admin/service-areas";
    const method = editingId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }

    if (!res.ok) {
      setStatus("Erreur de sauvegarde");
      return;
    }

    setStatus(editingId ? "Zone mise a jour" : "Zone creee");
    setForm(emptyForm);
    setEditingId(null);
    await load();
  }

  function startEdit(a: ServiceArea) {
    setEditingId(a.id);
    setForm({
      city: a.city,
      country: a.country ?? "",
      description: a.description ?? "",
      isPublished: a.isPublished,
      seoTitle: a.seoTitle ?? "",
      seoDescription: a.seoDescription ?? "",
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette zone ?")) return;

    const res = await fetch(`/api/admin/service-areas/${id}`, { method: "DELETE" });

    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }

    if (!res.ok) {
      setStatus("Erreur de suppression");
      return;
    }

    setStatus("Zone supprimee");
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Zones d&apos;intervention</h1>

      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Ville" value={form.city} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} required />
        <input className="rounded border p-2" placeholder="Pays" value={form.country ?? ""} onChange={(e) => setForm((s) => ({ ...s, country: e.target.value }))} />
        <textarea className="rounded border p-2 md:col-span-2" placeholder="Description" rows={4} value={form.description ?? ""} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} />
        <input className="rounded border p-2" placeholder="SEO title" value={form.seoTitle ?? ""} onChange={(e) => setForm((s) => ({ ...s, seoTitle: e.target.value }))} />
        <input className="rounded border p-2" placeholder="SEO description" value={form.seoDescription ?? ""} onChange={(e) => setForm((s) => ({ ...s, seoDescription: e.target.value }))} />
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
        {items.map((a) => (
          <div key={a.id} className="flex items-start justify-between rounded-lg border bg-white p-3">
            <div>
              <p className="font-semibold">{a.city} <span className="text-xs text-zinc-500">/{a.slug}</span></p>
              <p className="text-sm text-zinc-600">{a.description || "Pas de description"}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => startEdit(a)}>Editer</button>
              <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-700" onClick={() => remove(a.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
