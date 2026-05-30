"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";

type BlockInput = {
  content: string;
  imageUrl?: string | null;
  position: number;
};

type BlogArticle = {
  id: string;
  title: string;
  slug: string;
  intro: string;
  isPublished: boolean;
  position: number;
  blocks: BlockInput[];
};

type BlogArticleInput = Omit<BlogArticle, "id" | "slug">;

const emptyForm: BlogArticleInput = {
  title: "",
  intro: "",
  isPublished: true,
  position: 0,
  blocks: [],
};

export default function AdminBlogPage() {
  const router = useRouter();
  const [items, setItems] = useState<BlogArticle[]>([]);
  const [form, setForm] = useState<BlogArticleInput>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const actionLabel = useMemo(() => (editingId ? "Mettre a jour" : "Creer"), [editingId]);

  async function load() {
    const res = await fetch("/api/admin/blog", { cache: "no-store" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) return;
    setItems(await res.json());
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addBlock() {
    setForm((s) => ({
      ...s,
      blocks: [...s.blocks, { content: "", imageUrl: "", position: s.blocks.length }],
    }));
  }

  function updateBlock(index: number, patch: Partial<BlockInput>) {
    setForm((s) => ({
      ...s,
      blocks: s.blocks.map((block, i) => (i === index ? { ...block, ...patch } : block)),
    }));
  }

  function removeBlock(index: number) {
    setForm((s) => ({
      ...s,
      blocks: s.blocks.filter((_, i) => i !== index).map((block, i) => ({ ...block, position: i })),
    }));
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("Enregistrement...");

    const payload = {
      ...form,
      position: Number(form.position) || 0,
      blocks: form.blocks
        .filter((block) => block.content.trim().length > 0)
        .map((block, index) => ({
          content: block.content,
          imageUrl: block.imageUrl || null,
          position: Number.isInteger(block.position) ? block.position : index,
        })),
    };

    const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
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

    setStatus(editingId ? "Article mis a jour" : "Article cree");
    setForm(emptyForm);
    setEditingId(null);
    await load();
  }

  function startEdit(article: BlogArticle) {
    setEditingId(article.id);
    setForm({
      title: article.title,
      intro: article.intro,
      isPublished: article.isPublished,
      position: article.position,
      blocks: (article.blocks ?? []).map((block, index) => ({
        content: block.content,
        imageUrl: block.imageUrl ?? "",
        position: Number.isInteger(block.position) ? block.position : index,
      })),
    });
  }

  async function remove(id: string) {
    if (!confirm("Supprimer cet article ?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.status === 401) {
      router.push("/admin/login?reason=session-expired");
      return;
    }
    if (!res.ok) {
      setStatus("Erreur de suppression");
      return;
    }
    setStatus("Article supprime");
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Blog</h1>
      <p className="text-sm text-zinc-600">Ajoutez des articles SEO avec une introduction et autant de paragraphes que necessaire.</p>

      <form onSubmit={submit} className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-2">
        <input
          className="rounded border p-2"
          placeholder="Titre de l'article"
          value={form.title}
          onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
          required
        />
        <input
          className="rounded border p-2"
          placeholder="Position"
          type="number"
          value={form.position}
          onChange={(e) => setForm((s) => ({ ...s, position: Number(e.target.value) }))}
        />
        <textarea
          className="rounded border p-2 md:col-span-2"
          placeholder="Introduction rapide"
          rows={3}
          value={form.intro}
          onChange={(e) => setForm((s) => ({ ...s, intro: e.target.value }))}
          required
        />

        <div className="space-y-3 rounded border border-zinc-200 p-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">Paragraphes</p>
            <button type="button" className="rounded border px-3 py-1 text-sm" onClick={addBlock}>
              Ajouter un paragraphe
            </button>
          </div>

          {form.blocks.length === 0 ? <p className="text-sm text-zinc-500">Aucun paragraphe ajoute.</p> : null}

          {form.blocks.map((block, index) => (
            <div key={index} className="grid gap-2 rounded border border-zinc-200 p-3 md:grid-cols-2">
              <textarea
                className="rounded border p-2"
                placeholder={`Paragraphe ${index + 1}`}
                rows={5}
                value={block.content}
                onChange={(e) => updateBlock(index, { content: e.target.value })}
              />
              <div className="space-y-2">
                <AdminImageUploadField
                  label={`Image paragraphe ${index + 1} (optionnel)`}
                  value={block.imageUrl}
                  onChange={(url) => updateBlock(index, { imageUrl: url })}
                />
                <button
                  type="button"
                  className="rounded border border-red-300 px-3 py-1 text-sm text-red-700"
                  onClick={() => removeBlock(index)}
                >
                  Supprimer ce paragraphe
                </button>
              </div>
            </div>
          ))}
        </div>

        <label className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm((s) => ({ ...s, isPublished: e.target.checked }))} />
          Publie
        </label>
        <div className="md:col-span-2">
          <button className="rounded bg-zinc-900 px-4 py-2 text-white" type="submit">{actionLabel}</button>
          {editingId ? (
            <button
              type="button"
              className="ml-2 rounded border px-4 py-2"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Annuler
            </button>
          ) : null}
          {status ? <span className="ml-3 text-sm">{status}</span> : null}
        </div>
      </form>

      <div className="space-y-2">
        {items.map((article) => (
          <div key={article.id} className="flex items-start justify-between rounded-lg border bg-white p-3">
            <div>
              <p className="font-semibold">{article.title} <span className="text-xs text-zinc-500">/{article.slug}</span></p>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-600">{article.intro}</p>
              <p className="text-xs text-zinc-500">{article.blocks.length} paragraphe(s) | {article.isPublished ? "publie" : "brouillon"}</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded border px-3 py-1 text-sm" onClick={() => startEdit(article)}>Editer</button>
              <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-700" onClick={() => remove(article.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
