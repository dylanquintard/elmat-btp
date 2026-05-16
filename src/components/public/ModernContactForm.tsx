"use client";

import { useState } from "react";

export function ModernContactForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setStatus("");
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    setStatus(data.message ?? (res.ok ? "Demande envoyee." : "Erreur, merci de verifier vos informations."));
    setLoading(false);
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm md:p-6">
      <div className="grid gap-3 md:grid-cols-2">
        <input className="w-full rounded-lg border border-zinc-300 px-3 py-3 outline-none transition focus:border-amber-500" name="name" placeholder="Nom complet *" required />
        <input className="w-full rounded-lg border border-zinc-300 px-3 py-3 outline-none transition focus:border-amber-500" name="phone" placeholder="Telephone *" required />
        <input className="w-full rounded-lg border border-zinc-300 px-3 py-3 outline-none transition focus:border-amber-500" name="email" placeholder="Email" type="email" />
        <input className="w-full rounded-lg border border-zinc-300 px-3 py-3 outline-none transition focus:border-amber-500" name="city" placeholder="Ville du chantier" />
        <select className="w-full rounded-lg border border-zinc-300 px-3 py-3 outline-none transition focus:border-amber-500" name="projectType" defaultValue="">
          <option value="">Type de projet</option>
          <option value="maconnerie">Maconnerie</option>
          <option value="renovation">Renovation</option>
          <option value="demolition">Demolition</option>
          <option value="autre">Autre</option>
        </select>
        <select className="w-full rounded-lg border border-zinc-300 px-3 py-3 outline-none transition focus:border-amber-500" name="budget" defaultValue="">
          <option value="">Budget estimatif</option>
          <option value="<10k">Moins de 10 000 EUR</option>
          <option value="10k-30k">10 000 a 30 000 EUR</option>
          <option value="30k-70k">30 000 a 70 000 EUR</option>
          <option value=">70k">Plus de 70 000 EUR</option>
        </select>
      </div>

      <textarea
        className="min-h-36 w-full rounded-lg border border-zinc-300 px-3 py-3 outline-none transition focus:border-amber-500"
        name="message"
        placeholder="Decrivez votre besoin (surface, delai, contraintes...) *"
        required
        minLength={10}
      />

      <div className="flex items-center gap-3">
        <button disabled={loading} className="rounded-lg bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-60" type="submit">
          {loading ? "Envoi..." : "Envoyer ma demande"}
        </button>
        <p className="text-xs text-zinc-500">Reponse sous 24h ouvrées.</p>
      </div>

      {status ? <p className="rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-700">{status}</p> : null}
    </form>
  );
}
