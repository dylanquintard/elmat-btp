"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";

type ServiceLite = { id: string; title: string };
type ProjectImageType = "BEFORE" | "DURING" | "AFTER" | "GENERAL";

type ProjectImageInput = {
  url: string;
  alt?: string | null;
  type: ProjectImageType;
  position: number;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  city?: string | null;
  country?: string | null;
  duration?: string | null;
  description: string;
  detailedDescription?: string | null;
  problem?: string | null;
  solution?: string | null;
  serviceId?: string | null;
  isPublished: boolean;
  position: number;
  images: ProjectImageInput[];
};

type ProjectInput = Omit<Project, "id" | "slug">;

const emptyForm: ProjectInput = {
  title: "",
  city: "",
  country: "",
  duration: "",
  description: "",
  detailedDescription: "",
  problem: "",
  solution: "",
  serviceId: "",
  isPublished: true,
  position: 0,
  images: [],
};

export default function AdminRealisationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Project[]>([]);
  const [services, setServices] = useState<ServiceLite[]>([]);
  const [form, setForm] = useState<ProjectInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draggingImageIndex, setDraggingImageIndex] = useState<number | null>(null);
  const [cleanupStatus, setCleanupStatus] = useState("");
  const [orphanFiles, setOrphanFiles] = useState<string[]>([]);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [status, setStatus] = useState("");

  const actionLabel = useMemo(() => (editingId ? "Mettre a jour" : "Creer"), [editingId]);

  async function load() {
    const res = await fetch("/api/admin/projects", { cache: "no-store" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) return;
    const data = await res.json();
    setItems(data.projects ?? []);
    setServices(data.services ?? []);
  }

  useEffect(() => {
    fetch("/api/admin/projects", { cache: "no-store" })
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
        setItems(data.projects ?? []);
        setServices(data.services ?? []);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addImage() {
    const index = form.images.length;
    const autoType: ProjectImageType =
      index === 0 ? "BEFORE" : index === 1 ? "AFTER" : "GENERAL";
    setForm((s) => ({
      ...s,
      images: [...s.images, { url: "", alt: "", type: autoType, position: s.images.length }],
    }));
  }

  function updateImage(index: number, patch: Partial<ProjectImageInput>) {
    setForm((s) => ({
      ...s,
      images: s.images.map((img, i) => (i === index ? { ...img, ...patch } : img)),
    }));
  }

  function removeImage(index: number) {
    setForm((s) => ({
      ...s,
      images: s.images.filter((_, i) => i !== index).map((img, i) => ({ ...img, position: i })),
    }));
  }

  function moveImage(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    setForm((s) => {
      const next = [...s.images];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return {
        ...s,
        images: next.map((img, i) => ({ ...img, position: i })),
      };
    });
  }

  async function cleanupUploads(apply: boolean) {
    setCleanupLoading(true);
    setCleanupStatus(apply ? "Nettoyage en cours..." : "Analyse en cours...");
    const res = await fetch("/api/admin/uploads/cleanup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apply }),
    });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      setCleanupLoading(false);
      return;
    }
    if (!res.ok) {
      setCleanupStatus("Echec du cleanup");
      setCleanupLoading(false);
      return;
    }
    const data = await res.json();
    setOrphanFiles(data.orphanFiles ?? []);
    const count = apply ? data.deletedFiles.length : data.orphanFiles.length;
    setCleanupStatus(apply ? `${count} fichier(s) supprime(s)` : `${count} fichier(s) orphelin(s) detecte(s)`);
    setCleanupLoading(false);
  }

  async function confirmAndCleanup() {
    if (orphanFiles.length === 0) {
      setCleanupStatus("Aucun fichier orphelin a supprimer.");
      return;
    }

    const sample = orphanFiles.slice(0, 5).join("\n- ");
    const suffix = orphanFiles.length > 5 ? `\n... +${orphanFiles.length - 5} autre(s)` : "";
    const confirmed = confirm(
      `Supprimer ${orphanFiles.length} fichier(s) orphelin(s) ?\n\n- ${sample}${suffix}`
    );
    if (!confirmed) return;
    await cleanupUploads(true);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Enregistrement...");

    const filteredImages = form.images
      .filter((img) => Boolean(img.url))
      .map((img, i) => ({ ...img, position: Number.isInteger(img.position) ? img.position : i }));

    if (form.isPublished && filteredImages.length === 0) {
      setStatus("Ajoutez au moins une image avant publication.");
      return;
    }

    const hasBefore = filteredImages.some((img) => img.type === "BEFORE");
    const hasAfter = filteredImages.some((img) => img.type === "AFTER");
    if (form.isPublished && (!hasBefore || !hasAfter)) {
      setStatus("Ajoutez au minimum 1 photo BEFORE et 1 photo AFTER pour le rendu avant/apres.");
      return;
    }

    const payload = {
      ...form,
      position: Number(form.position) || 0,
      serviceId: form.serviceId || null,
      images: filteredImages,
    };

    const url = editingId ? `/api/admin/projects/${editingId}` : "/api/admin/projects";
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

    setStatus(editingId ? "Realisation mise a jour" : "Realisation creee");
    setForm(emptyForm);
    setEditingId(null);
    await load();
  }

  function startEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      city: p.city ?? "",
      country: p.country ?? "",
      duration: p.duration ?? "",
      description: p.description,
      detailedDescription: p.detailedDescription ?? "",
      problem: p.problem ?? "",
      solution: p.solution ?? "",
      serviceId: p.serviceId ?? "",
      isPublished: p.isPublished,
      position: p.position,
      images: (p.images ?? []).map((img, i) => ({
        url: img.url,
        alt: img.alt ?? "",
        type: img.type,
        position: Number.isInteger(img.position) ? img.position : i,
      })),
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cette realisation ?")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) {
      setStatus("Erreur de suppression");
      return;
    }
    setStatus("Realisation supprimee");
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Realisations</h1>
      <p className="text-sm text-zinc-600">
        Les images ajoutees ici alimentent automatiquement la galerie publique des chantiers.
      </p>

      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input className="rounded border p-2" placeholder="Titre" value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} required />
        <input className="rounded border p-2" placeholder="Position" type="number" value={form.position} onChange={(e) => setForm((s) => ({ ...s, position: Number(e.target.value) }))} />
        <input className="rounded border p-2" placeholder="Ville" value={form.city ?? ""} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Pays" value={form.country ?? ""} onChange={(e) => setForm((s) => ({ ...s, country: e.target.value }))} />
        <input className="rounded border p-2" placeholder="Duree" value={form.duration ?? ""} onChange={(e) => setForm((s) => ({ ...s, duration: e.target.value }))} />
        <select className="rounded border p-2" value={form.serviceId ?? ""} onChange={(e) => setForm((s) => ({ ...s, serviceId: e.target.value }))}>
          <option value="">Sans service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
        <textarea className="rounded border p-2 md:col-span-2" placeholder="Description courte (liste des chantiers)" rows={3} value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} required />
        <textarea className="rounded border p-2 md:col-span-2" placeholder="Description detaillee (page chantier)" rows={6} value={form.detailedDescription ?? ""} onChange={(e) => setForm((s) => ({ ...s, detailedDescription: e.target.value }))} />
        <textarea className="rounded border p-2" placeholder="Probleme initial" rows={3} value={form.problem ?? ""} onChange={(e) => setForm((s) => ({ ...s, problem: e.target.value }))} />
        <textarea className="rounded border p-2" placeholder="Solution apportee" rows={3} value={form.solution ?? ""} onChange={(e) => setForm((s) => ({ ...s, solution: e.target.value }))} />

        <div className="space-y-3 md:col-span-2 rounded border border-zinc-200 p-3">
          <div className="flex items-center justify-between">
            <p className="font-medium">Images du chantier</p>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded border px-3 py-1 text-sm"
                onClick={() => cleanupUploads(false)}
                disabled={cleanupLoading}
              >
                {cleanupLoading ? "..." : "Analyser orphelins"}
              </button>
              <button
                type="button"
                className="rounded border border-red-300 px-3 py-1 text-sm text-red-700 disabled:opacity-60"
                onClick={confirmAndCleanup}
                disabled={cleanupLoading || orphanFiles.length === 0}
                title={orphanFiles.length === 0 ? "Lancer d'abord une analyse" : "Supprimer les orphelins detectes"}
              >
                Nettoyer orphelins
              </button>
              <button type="button" className="rounded border px-3 py-1 text-sm" onClick={addImage}>Ajouter une image</button>
            </div>
          </div>
          {cleanupStatus ? <p className="text-sm text-zinc-600">{cleanupStatus}</p> : null}
          {orphanFiles.length > 0 ? (
            <div className="rounded border border-amber-200 bg-amber-50 p-2">
              <p className="text-sm font-medium text-amber-800">Fichiers orphelins detectes ({orphanFiles.length})</p>
              <ul className="mt-2 max-h-28 space-y-1 overflow-auto text-xs text-amber-900">
                {orphanFiles.map((file) => (
                  <li key={file} className="font-mono">{file}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {form.images.length === 0 ? <p className="text-sm text-zinc-500">Aucune image ajoutee.</p> : null}

          <div className="grid gap-3">
            {form.images.map((img, i) => (
              <div
                key={`${img.url}-${i}`}
                className={`grid gap-2 rounded border border-zinc-200 p-3 md:grid-cols-2 ${draggingImageIndex === i ? "opacity-70" : ""}`}
                draggable
                onDragStart={() => setDraggingImageIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggingImageIndex !== null) moveImage(draggingImageIndex, i);
                  setDraggingImageIndex(null);
                }}
                onDragEnd={() => setDraggingImageIndex(null)}
              >
                <AdminImageUploadField
                  label={`Image ${i + 1}`}
                  value={img.url}
                  onChange={(url) => updateImage(i, { url })}
                />
                <div className="space-y-2">
                  <select
                    className="w-full rounded border p-2"
                    value={img.type}
                    onChange={(e) => updateImage(i, { type: e.target.value as ProjectImageType })}
                  >
                    <option value="GENERAL">Galerie chantier</option>
                    <option value="BEFORE">Avant (slider)</option>
                    <option value="DURING">Pendant travaux</option>
                    <option value="AFTER">Apres (photo de presentation)</option>
                  </select>
                  <input
                    className="w-full rounded border p-2"
                    placeholder="Texte image (alt)"
                    value={img.alt ?? ""}
                    onChange={(e) => updateImage(i, { alt: e.target.value })}
                  />
                  <button
                    type="button"
                    className="rounded border border-red-300 px-3 py-1 text-sm text-red-700"
                    onClick={() => removeImage(i)}
                  >
                    Supprimer cette image
                  </button>
                </div>
              </div>
            ))}
          </div>
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
        {items.map((p) => (
          <div key={p.id} className="flex items-start justify-between rounded-lg border bg-white p-3">
            <div className="flex gap-3">
              <div className="flex gap-1">
                {(p.images ?? []).slice(0, 3).map((img, index) => (
                  <div key={`${img.url}-${index}`} className="relative h-12 w-16 overflow-hidden rounded border bg-zinc-100">
                    <Image src={img.url} alt={img.alt ?? p.title} fill sizes="64px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div>
              <p className="font-semibold">{p.title} <span className="text-xs text-zinc-500">/{p.slug}</span></p>
              <p className="text-sm text-zinc-600">{p.city ?? "-"} - {(p.images?.length ?? 0)} image(s)</p>
              <p className="text-xs text-zinc-500">{p.detailedDescription ? "Description detaillee: oui" : "Description detaillee: non"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => startEdit(p)}>Editer</button>
              <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-700" onClick={() => remove(p.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
