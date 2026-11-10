/**
 * Tiny document store with two interchangeable drivers:
 *
 *  - Supabase (production): one `documents` table + one public storage bucket.
 *    Used when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.
 *  - Local files (development): JSON files in .data/, uploads in .data/uploads.
 *
 * Both are server-only. The service-role key never reaches the browser.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Doc = { id: string; createdAt?: string } & Record<string, unknown>;

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const SEED_DIR = path.join(process.cwd(), "data", "seed");
const BUCKET = process.env.SUPABASE_BUCKET || "smc-files";

let client: SupabaseClient | null = null;
function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
export const storeDriver = () => (supabase() ? "supabase" : "local");

/* ---------------- local driver ---------------- */

async function readLocal(collection: string): Promise<Doc[]> {
  for (const dir of [DATA_DIR, SEED_DIR]) {
    try {
      return JSON.parse(await fs.readFile(path.join(dir, `${collection}.json`), "utf8"));
    } catch {
      /* fall through to seed, then empty */
    }
  }
  return [];
}

let writeQueue: Promise<unknown> = Promise.resolve();
function writeLocal(collection: string, mutate: (docs: Doc[]) => Doc[]) {
  // serialise writes so concurrent requests cannot clobber each other
  const run = writeQueue.then(async () => {
    const docs = mutate(await readLocal(collection));
    await fs.mkdir(DATA_DIR, { recursive: true });
    const file = path.join(DATA_DIR, `${collection}.json`);
    await fs.writeFile(file + ".tmp", JSON.stringify(docs, null, 2));
    await fs.rename(file + ".tmp", file);
  });
  writeQueue = run.catch(() => {});
  return run;
}

/* ---------------- public API ---------------- */

export async function list<T extends Doc>(collection: string): Promise<T[]> {
  const sb = supabase();
  if (!sb) return (await readLocal(collection)) as T[];
  const { data, error } = await sb.from("documents").select("id,data,created_at").eq("collection", collection);
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ ...(r.data as object), id: r.id, createdAt: r.created_at }) as T);
}

export async function get<T extends Doc>(collection: string, id: string): Promise<T | null> {
  return (await list<T>(collection)).find((d) => d.id === id) ?? null;
}

export async function upsert(collection: string, doc: Doc) {
  const sb = supabase();
  if (!sb) {
    return writeLocal(collection, (docs) => {
      const i = docs.findIndex((d) => d.id === doc.id);
      if (i >= 0) docs[i] = { ...docs[i], ...doc };
      else docs.push(doc);
      return docs;
    });
  }
  const { id, createdAt, ...data } = doc;
  const { error } = await sb
    .from("documents")
    .upsert({ collection, id, data, ...(createdAt ? { created_at: createdAt } : {}) }, { onConflict: "collection,id" });
  if (error) throw new Error(error.message);
}

export async function upsertMany(collection: string, docs: Doc[]) {
  for (const d of docs) await upsert(collection, d);
}

export async function remove(collection: string, id: string) {
  const sb = supabase();
  if (!sb) return writeLocal(collection, (docs) => docs.filter((d) => d.id !== id));
  const { error } = await sb.from("documents").delete().eq("collection", collection).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function saveFile(name: string, bytes: Buffer, contentType: string): Promise<string> {
  const sb = supabase();
  if (!sb) {
    const dir = path.join(DATA_DIR, "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), bytes);
    return `/files/${name}`;
  }
  const { error } = await sb.storage.from(BUCKET).upload(name, bytes, { contentType, upsert: false });
  if (error) throw new Error(error.message);
  return sb.storage.from(BUCKET).getPublicUrl(name).data.publicUrl;
}

export async function readLocalFile(name: string) {
  if (!/^[\w-]+\.(pdf|jpg|png|webp)$/.test(name)) return null;
  try {
    return await fs.readFile(path.join(DATA_DIR, "uploads", name));
  } catch {
    return null;
  }
}
