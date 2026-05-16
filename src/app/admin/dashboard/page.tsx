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
        <div className="rounded border bg-white p-3">Services: {services}</div>
        <div className="rounded border bg-white p-3">Realisations: {projects}</div>
        <div className="rounded border bg-white p-3">Avis: {testimonials}</div>
        <div className="rounded border bg-white p-3">Demandes non lues: {unread}</div>
      </div>
    </div>
  );
}

