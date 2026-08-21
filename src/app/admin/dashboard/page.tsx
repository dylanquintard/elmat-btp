export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [services, projects, testimonials, unread] = await Promise.all([
    prisma.service.count(),
    prisma.project.count(),
    prisma.testimonial.count(),
    prisma.contactRequest.count({ where: { isRead: false } }),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-3 md:grid-cols-4">
        <div className="admin-card rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Services</p>
          <p className="mt-2 text-3xl font-bold">{services}</p>
        </div>
        <div className="admin-card rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Réalisations</p>
          <p className="mt-2 text-3xl font-bold">{projects}</p>
        </div>
        <div className="admin-card rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Avis</p>
          <p className="mt-2 text-3xl font-bold">{testimonials}</p>
        </div>
        <div className="admin-card rounded-xl border p-4">
          <p className="text-sm text-zinc-500">Demandes non lues</p>
          <p className="mt-2 text-3xl font-bold">{unread}</p>
        </div>
      </div>
    </div>
  );
}

