import Link from "next/link";
import type { Metadata } from "next";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const links = [
  ["Dashboard", "/admin/dashboard"],
  ["Parametres", "/admin/settings"],
  ["Services", "/admin/services"],
  ["Zones", "/admin/zones-intervention"],
  ["Realisations", "/admin/realisations"],
  ["Galerie", "/admin/galerie"],
  ["Blog", "/admin/blog"],
  ["Avis", "/admin/avis"],
  ["Demandes", "/admin/demandes"],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="admin-sidebar rounded-xl border p-4 md:sticky md:top-28 md:self-start">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Administration</h2>
          <AdminLogoutButton />
        </div>
        <nav className="space-y-2 text-sm">
          {links.map(([name, href]) => (
            <Link key={href} href={href} className="block rounded px-2 py-1 text-zinc-200 transition hover:bg-zinc-100">
              {name}
            </Link>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
