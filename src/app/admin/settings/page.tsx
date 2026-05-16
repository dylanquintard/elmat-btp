"use client";

import { useEffect, useState } from "react";
import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";

type SiteSetting = {
  companyName: string;
  slogan?: string | null;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  postalCode?: string | null;
  city?: string | null;
  country?: string | null;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  googleMapsUrl?: string | null;
  openingHours?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

const initialState: SiteSetting = {
  companyName: "",
  slogan: "",
  description: "",
  phone: "",
  email: "",
  address: "",
  postalCode: "",
  city: "",
  country: "",
  logoUrl: "",
  heroImageUrl: "",
  facebookUrl: "",
  instagramUrl: "",
  googleMapsUrl: "",
  openingHours: "",
  seoTitle: "",
  seoDescription: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSetting>(initialState);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/settings", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (!data) return;
      setForm({ ...initialState, ...data });
    })();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Enregistrement...");

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setStatus(res.ok ? "Parametres sauvegardes" : "Erreur de sauvegarde");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Parametres du site</h1>
      <form onSubmit={onSubmit} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Nom entreprise" value={form.companyName} onChange={(e) => setForm((s) => ({ ...s, companyName: e.target.value }))} required />
        <input className="rounded border p-2" placeholder="Slogan" value={form.slogan ?? ""} onChange={(e) => setForm((s) => ({ ...s, slogan: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Telephone" value={form.phone ?? ""} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Email" type="email" value={form.email ?? ""} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
        <input className="rounded border p-2 md:col-span-2" placeholder="Adresse" value={form.address ?? ""} onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Code postal" value={form.postalCode ?? ""} onChange={(e) => setForm((s) => ({ ...s, postalCode: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Ville" value={form.city ?? ""} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Pays" value={form.country ?? ""} onChange={(e) => setForm((s) => ({ ...s, country: e.target.value }))} />
        <div className="md:col-span-2">
          <AdminImageUploadField
            label="Logo entreprise"
            value={form.logoUrl ?? ""}
            onChange={(url) => setForm((s) => ({ ...s, logoUrl: url }))}
            uploadKind="logo"
          />
        </div>
        <input className="rounded border p-2 md:col-span-2" placeholder="URL image hero (manuel, plus tard)" value={form.heroImageUrl ?? ""} onChange={(e) => setForm((s) => ({ ...s, heroImageUrl: e.target.value }))} />
        <input className="rounded border p-2" placeholder="URL Facebook" value={form.facebookUrl ?? ""} onChange={(e) => setForm((s) => ({ ...s, facebookUrl: e.target.value }))} />
        <input className="rounded border p-2" placeholder="URL Instagram" value={form.instagramUrl ?? ""} onChange={(e) => setForm((s) => ({ ...s, instagramUrl: e.target.value }))} />
        <input className="rounded border p-2 md:col-span-2" placeholder="URL Google Maps" value={form.googleMapsUrl ?? ""} onChange={(e) => setForm((s) => ({ ...s, googleMapsUrl: e.target.value }))} />
        <input className="rounded border p-2 md:col-span-2" placeholder="Horaires d'ouverture" value={form.openingHours ?? ""} onChange={(e) => setForm((s) => ({ ...s, openingHours: e.target.value }))} />
        <textarea className="rounded border p-2 md:col-span-2" placeholder="Description" value={form.description ?? ""} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} rows={4} />
        <input className="rounded border p-2" placeholder="SEO title" value={form.seoTitle ?? ""} onChange={(e) => setForm((s) => ({ ...s, seoTitle: e.target.value }))} />
        <input className="rounded border p-2" placeholder="SEO description" value={form.seoDescription ?? ""} onChange={(e) => setForm((s) => ({ ...s, seoDescription: e.target.value }))} />
        <div className="md:col-span-2">
          <button className="rounded bg-zinc-900 px-4 py-2 text-white" type="submit">Sauvegarder</button>
          {status ? <span className="ml-3 text-sm">{status}</span> : null}
        </div>
      </form>
    </div>
  );
}
