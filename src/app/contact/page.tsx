import { ModernContactForm } from "@/components/public/ModernContactForm";
import { getDefaultMetadata, getNapData } from "@/lib/seo";

export async function generateMetadata() {
  return getDefaultMetadata(
    "Contact et devis maconnerie en Haute-Savoie",
    "Demandez un devis pour vos travaux de maconnerie, renovation ou demolition en Haute-Savoie et proximite Geneve cote France.",
    { path: "/contact" }
  );
}

function toTelHref(value?: string | null) {
  const cleaned = (value ?? "").replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "tel:+33000000000";
}

export default async function ContactPage() {
  const nap = await getNapData();
  const phoneHref = toTelHref(nap.phone);
  const addressParts = [nap.address, nap.postalCode, nap.city].filter(Boolean);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl bg-zinc-900 p-7 text-zinc-100 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(245,158,11,0.2),transparent_35%)]" />
        <p className="text-sm font-medium text-amber-400">Devis gratuit</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">Parlons de votre chantier</h1>
        <p className="mt-3 max-w-2xl text-zinc-300">
          Decrivez votre projet et recevez un premier retour rapide avec les prochaines etapes.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <a href={phoneHref} className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-zinc-900">
            {nap.phone}
          </a>
          <a href={`mailto:${nap.email}`} className="rounded-lg border border-zinc-600 px-4 py-2">
            {nap.email}
          </a>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <ModernContactForm />
        <aside className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Informations entreprise</h2>
          <div className="space-y-2 text-sm text-zinc-700">
            <p><strong>Entreprise:</strong> {nap.companyName}</p>
            <p><strong>Telephone:</strong> {nap.phone}</p>
            <p><strong>Email:</strong> {nap.email}</p>
            <p><strong>Adresse:</strong> {addressParts.length ? addressParts.join(", ") : "A renseigner dans les parametres"}</p>
            {nap.openingHours ? <p><strong>Horaires:</strong> {nap.openingHours}</p> : null}
            {nap.googleMapsUrl ? (
              <p>
                <a href={nap.googleMapsUrl} target="_blank" rel="noreferrer" className="font-semibold text-amber-700 underline">
                  Voir l&apos;adresse sur Google Maps
                </a>
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
