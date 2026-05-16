import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminContactRequestUpdateSchema } from "@/lib/admin-validations";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const parsed = adminContactRequestUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.contactRequest.update({
    where: { id },
    data: { isRead: parsed.data.isRead },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.contactRequest.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
