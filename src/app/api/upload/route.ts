import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { verifyAdminToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { getUploadDir } from "@/lib/upload-path";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((v) => v.trim())
    .find((v) => v.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.split("=")[1];

  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    await verifyAdminToken(token);
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Fichier manquant" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ message: "Format non supporte" }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "Fichier trop volumineux" }, { status: 400 });
  }

  const filename = `${Date.now()}-${randomUUID()}.webp`;

  const uploadDir = getUploadDir();
  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const input = Buffer.from(bytes);

  const base = sharp(input).rotate();

  // For logos, remove transparent useless borders before optimization.
  const output =
    kind === "logo"
      ? await base.trim().webp({ quality: 90, effort: 5 }).toBuffer()
      : await base
          .resize({ width: 2200, height: 2200, fit: "inside", withoutEnlargement: true })
          .webp({ quality: 82, effort: 5 })
          .toBuffer();

  await writeFile(path.join(uploadDir, filename), output);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
