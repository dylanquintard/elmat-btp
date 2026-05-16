"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login?reason=logged-out");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="rounded border px-3 py-1 text-sm hover:bg-zinc-100 disabled:opacity-60"
    >
      {loading ? "Deconnexion..." : "Se deconnecter"}
    </button>
  );
}
