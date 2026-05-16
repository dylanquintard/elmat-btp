"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ContactRequest = {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  projectType?: string | null;
  budget?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminDemandesPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContactRequest[]>([]);
  const [status, setStatus] = useState("");

  async function load() {
    const res = await fetch("/api/admin/contact-requests", { cache: "no-store" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) return;
    setItems(await res.json());
  }

  useEffect(() => {
    fetch("/api/admin/contact-requests", { cache: "no-store" })
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

  async function markRead(id: string, isRead: boolean) {
    const res = await fetch(`/api/admin/contact-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead }),
    });

    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }

    if (!res.ok) {
      setStatus("Erreur de mise a jour");
      return;
    }

    setStatus("Demande mise a jour");
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette demande ?")) return;

    const res = await fetch(`/api/admin/contact-requests/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }

    if (!res.ok) {
      setStatus("Erreur de suppression");
      return;
    }

    setStatus("Demande supprimee");
    await load();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Demandes de devis</h1>
      {status ? <p className="text-sm text-zinc-600">{status}</p> : null}

      <div className="space-y-3">
        {items.map((r) => (
          <div key={r.id} className="rounded border bg-white p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-semibold">{r.name}</p>
              <span className={`rounded px-2 py-1 text-xs ${r.isRead ? "bg-zinc-100" : "bg-amber-100 text-amber-700"}`}>
                {r.isRead ? "Lue" : "Non lue"}
              </span>
            </div>
            <p className="text-sm">{r.phone} {r.email ? `- ${r.email}` : ""}</p>
            <p className="text-sm text-zinc-500">{r.city ?? "Ville non renseignee"}</p>
            <p className="mt-2 text-sm text-zinc-700">{r.message}</p>
            <div className="mt-3 flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => markRead(r.id, !r.isRead)}>
                {r.isRead ? "Marquer non lue" : "Marquer lue"}
              </button>
              <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-700" onClick={() => remove(r.id)}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
