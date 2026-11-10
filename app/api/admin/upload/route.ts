import { randomBytes } from "node:crypto";
import { guard } from "@/lib/auth";
import { saveFile } from "@/lib/store";

const TYPES: Record<string, { ext: string; max: number; magic: number[] }> = {
  "application/pdf": { ext: "pdf", max: 25 * 1024 * 1024, magic: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  "image/jpeg": { ext: "jpg", max: 8 * 1024 * 1024, magic: [0xff, 0xd8, 0xff] },
  "image/png": { ext: "png", max: 8 * 1024 * 1024, magic: [0x89, 0x50, 0x4e, 0x47] },
  "image/webp": { ext: "webp", max: 8 * 1024 * 1024, magic: [0x52, 0x49, 0x46, 0x46] }, // RIFF
};

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "Choose a file to upload." }, { status: 400 });

  const type = TYPES[file.type];
  if (!type) return Response.json({ error: "Only PDF, JPG, PNG or WebP files can be uploaded." }, { status: 415 });
  if (file.size > type.max)
    return Response.json({ error: `File is too large (limit ${Math.round(type.max / 1048576)} MB).` }, { status: 413 });

  const bytes = Buffer.from(await file.arrayBuffer());
  if (!type.magic.every((b, i) => bytes[i] === b))
    return Response.json({ error: "That file does not look like a valid " + type.ext.toUpperCase() + "." }, { status: 415 });

  try {
    const url = await saveFile(`${Date.now()}-${randomBytes(6).toString("hex")}.${type.ext}`, bytes, file.type);
    return Response.json({ url });
  } catch (e) {
    console.error("[upload]", e);
    return Response.json({ error: "Upload failed. Check that file storage is configured." }, { status: 500 });
  }
}
