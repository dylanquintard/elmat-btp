import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminTestimonialSchema } from "@/lib/admin-validations";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(testimonials);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = adminTestimonialSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: "Validation error", errors: parsed.error.flatten() }, { status: 400 });
  }

  const testimonial = await prisma.testimonial.create({ data: parsed.data });
  return NextResponse.json(testimonial, { status: 201 });
}
