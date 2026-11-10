import { randomUUID } from "node:crypto";
import { revalidateTag } from "next/cache";
import { guard } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";
import { COLLECTIONS, sanitize } from "@/lib/schema";
import { list, upsert } from "@/lib/store";

type Ctx = { params: Promise<{ collection: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const denied = guard(req);
  if (denied) return denied;
  const { collection } = await params;
  if (!COLLECTIONS[collection]) return Response.json({ error: "Unknown collection." }, { status: 404 });
  const items = await list(collection);
  items.sort((a, b) => String(b.createdAt ?? "").localeCompare(String(a.createdAt ?? "")));
  return Response.json({ items });
}

export async function POST(req: Request, { params }: Ctx) {
  const denied = guard(req);
  if (denied) return denied;
  const { collection } = await params;
  if (!COLLECTIONS[collection]?.create) return Response.json({ error: "Unknown collection." }, { status: 404 });
  const result = sanitize(collection, await req.json().catch(() => ({})), false);
  if (result.error) return Response.json({ error: result.error }, { status: 422 });
  const doc = { ...result.data, id: randomUUID(), createdAt: new Date().toISOString() };
  await upsert(collection, doc);
  revalidateTag(CONTENT_TAG, "max");
  return Response.json({ item: doc });
}
