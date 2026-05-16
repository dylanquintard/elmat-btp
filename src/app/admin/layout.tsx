import Link from "next/link";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";

const links = [
  ["Dashboard", "/admin/dashboard"],
  ["Parametres", "/admin/settings"],
  ["Services", "/admin/services"],
  ["Zones", "/admin/zones-intervention"],
  ["Realisations", "/admin/realisations"],
  ["Galerie", "/admin/galerie"],
  ["Avis", "/admin/avis"],
  ["Demandes", "/admin/demandes"],
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="rounded-xl border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">Administration</h2>
          <AdminLogoutButton />
        </div>
        <nav className="space-y-2 text-sm">
          {links.map(([name, href]) => (
            <Link key={href} href={href} className="block rounded px-2 py-1 hover:bg-zinc-100">
              {name}
            </Link>
          ))}
        </nav>
      </aside>
      <section>{children}</section>
    </div>
  );
}
