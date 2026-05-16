import { prisma } from "@/lib/prisma";
import { HeaderClient } from "@/components/layout/HeaderClient";

function toTelHref(value?: string | null) {
  const cleaned = (value ?? "").replace(/[^\d+]/g, "");
  return cleaned ? `tel:${cleaned}` : "tel:+33000000000";
}

export async function Header() {
  const settings = await prisma.siteSetting.findFirst();
  const companyName = settings?.companyName?.trim() || "Entreprise BTP";
  const logoUrl = settings?.logoUrl?.trim() || null;
  const phoneHref = toTelHref(settings?.phone);
  const phoneLabel = settings?.phone?.trim() || "Appeler";

  return (
    <HeaderClient companyName={companyName} logoUrl={logoUrl} phoneHref={phoneHref} phoneLabel={phoneLabel} />
  );
}
