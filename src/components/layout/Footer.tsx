import Link from "next/link";
import { getNapData } from "@/lib/seo";

export async function Footer() {
  const nap = await getNapData();
  const addressParts = [nap.address, nap.postalCode, nap.city].filter(Boolean);

  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-950 py-8 text-zinc-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p>{nap.companyName} - {nap.city} (Haute-Savoie 74, proximite Geneve)</p>
          {addressParts.length > 0 ? <p className="text-zinc-400">{addressParts.join(", ")}</p> : null}
          {nap.phone || nap.email ? <p className="text-zinc-400">{nap.phone}{nap.phone && nap.email ? " | " : ""}{nap.email}</p> : null}
        </div>
        <div className="flex gap-4">
          {nap.googleMapsUrl ? (
            <a href={nap.googleMapsUrl} target="_blank" rel="noreferrer" className="underline">
              Google Maps
            </a>
          ) : null}
          <Link href="/mentions-legales">Mentions legales</Link>
          <Link href="/contact">Demander un devis</Link>
        </div>
      </div>
    </footer>
  );
}
