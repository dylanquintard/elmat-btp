"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMessage] = useState(() => {
    if (typeof window === "undefined") return "";
    const reason = new URLSearchParams(window.location.search).get("reason");
    if (reason === "session-expired") return "Votre session a expire. Merci de vous reconnecter.";
    if (reason === "logged-out") return "Vous avez ete deconnecte.";
    return "";
  });

  async function onSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message ?? "Erreur de connexion");
      setLoading(false);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md rounded-xl border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Connexion admin</h1>
      {infoMessage ? <p className="mb-3 rounded border border-amber-200 bg-amber-50 p-2 text-sm text-amber-700">{infoMessage}</p> : null}
      <form className="space-y-3" action={onSubmit}>
        <input className="w-full rounded border p-2" type="email" name="email" placeholder="Email" required disabled={loading} />
        <input className="w-full rounded border p-2" type="password" name="password" placeholder="Mot de passe" required disabled={loading} />
        <button className="w-full rounded bg-zinc-900 p-2 text-white disabled:opacity-70" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <Link href="/" className="mt-4 block text-sm text-zinc-500">Retour au site</Link>
    </div>
  );
}
