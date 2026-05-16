import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminSettingsSchema } from "@/lib/admin-validations";

export async function GET() {
  const setting = await prisma.siteSetting.findFirst();
  return NextResponse.json(setting);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const parsed = adminSettingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.siteSetting.findFirst();

  const payload = {
    ...parsed.data,
    email: parsed.data.email || null,
  };

  const setting = existing
    ? await prisma.siteSetting.update({ where: { id: existing.id }, data: payload })
    : await prisma.siteSetting.create({ data: payload });

  return NextResponse.json(setting);
}
