"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Testimonial = {
  id: string;
  clientName: string;
  city?: string | null;
  country?: string | null;
  rating: number;
  message: string;
  isPublished: boolean;
  position: number;
};

type TestimonialInput = Omit<Testimonial, "id">;

const emptyForm: TestimonialInput = {
  clientName: "",
  city: "",
  country: "",
  rating: 5,
  message: "",
  isPublished: true,
  position: 0,
};

export default function AdminAvisPage() {
  const router = useRouter();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [form, setForm] = useState<TestimonialInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const actionLabel = useMemo(() => (editingId ? "Mettre a jour" : "Creer"), [editingId]);

  async function load() {
    const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) return;
    setItems(await res.json());
  }

  useEffect(() => {
    fetch("/api/admin/testimonials", { cache: "no-store" })
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

    const payload = { ...form, rating: Number(form.rating) || 5, position: Number(form.position) || 0 };
    const url = editingId ? `/api/admin/testimonials/${editingId}` : "/api/admin/testimonials";
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

    setStatus(editingId ? "Avis mis a jour" : "Avis cree");
    setForm(emptyForm);
    setEditingId(null);
    await load();
  }

  function startEdit(t: Testimonial) {
    setEditingId(t.id);
    setForm({
      clientName: t.clientName,
      city: t.city ?? "",
      country: t.country ?? "",
      rating: t.rating,
      message: t.message,
      isPublished: t.isPublished,
      position: t.position,
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet avis ?")) return;
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) {
      setStatus("Erreur de suppression");
      return;
    }
    setStatus("Avis supprime");
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Avis clients</h1>

      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Nom client" value={form.clientName} onChange={(e) => setForm((s) => ({ ...s, clientName: e.target.value }))} required />
        <input className="rounded border p-2" placeholder="Position" type="number" value={form.position} onChange={(e) => setForm((s) => ({ ...s, position: Number(e.target.value) }))} />
        <input className="rounded border p-2" placeholder="Ville" value={form.city ?? ""} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Pays" value={form.country ?? ""} onChange={(e) => setForm((s) => ({ ...s, country: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Note /5" type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((s) => ({ ...s, rating: Number(e.target.value) }))} />
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((s) => ({ ...s, isPublished: e.target.checked }))} />
          Publie
        </label>
        <textarea className="rounded border p-2 md:col-span-2" placeholder="Message" rows={4} value={form.message} onChange={(e) => setForm((s) => ({ ...s, message: e.target.value }))} required />
        <div className="md:col-span-2">
          <button className="rounded bg-zinc-900 px-4 py-2 text-white" type="submit">{actionLabel}</button>
          {editingId ? <button type="button" className="ml-2 rounded border px-4 py-2" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Annuler</button> : null}
          {status ? <span className="ml-3 text-sm">{status}</span> : null}
        </div>
      </form>

      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} className="flex items-start justify-between rounded-lg border bg-white p-3">
            <div>
              <p className="font-semibold">{t.clientName} - {"?".repeat(Math.max(1, Math.min(5, t.rating)))}</p>
              <p className="text-sm text-zinc-600">{t.city ?? "-"} - {t.message.slice(0, 100)}...</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => startEdit(t)}>Editer</button>
              <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-700" onClick={() => remove(t.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
