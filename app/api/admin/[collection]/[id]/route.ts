import { revalidateTag } from "next/cache";
import { guard } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";
import { COLLECTIONS, sanitize } from "@/lib/schema";
import { get, remove, upsert } from "@/lib/store";

type Ctx = { params: Promise<{ collection: string; id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  const denied = guard(req);
  if (denied) return denied;
  const { collection, id } = await params;
  if (!COLLECTIONS[collection]) return Response.json({ error: "Unknown collection." }, { status: 404 });
  const existing = await get(collection, id);
  if (!existing) return Response.json({ error: "Not found." }, { status: 404 });
  const result = sanitize(collection, await req.json().catch(() => ({})), true);
  if (result.error) return Response.json({ error: result.error }, { status: 422 });
  const doc = { ...existing, ...result.data, id };
  await upsert(collection, doc);
  revalidateTag(CONTENT_TAG, "max");
  return Response.json({ item: doc });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const denied = guard(req);
  if (denied) return denied;
  const { collection, id } = await params;
  if (!COLLECTIONS[collection]) return Response.json({ error: "Unknown collection." }, { status: 404 });
  await remove(collection, id);
  revalidateTag(CONTENT_TAG, "max");
  return Response.json({ ok: true });
}
