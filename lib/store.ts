/**
 * Tiny document store with two interchangeable drivers:
 *
 *  - Supabase (production). Tables are closed to the public (Row Level Security
 *    with no policies). The server calls a handful of database functions
 *    (supabase/schema.sql) using the project's publishable key plus an app
 *    secret, SMC_API_SECRET, which the functions verify against a stored hash.
 *    No service-role key is needed anywhere.
 *  - Local files (development): JSON files in .data/, uploads in .data/uploads.
 *
 * Both are server-only: the app secret never reaches the browser.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Doc = { id: string; createdAt?: string } & Record<string, unknown>;

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const SEED_DIR = path.join(process.cwd(), "data", "seed");

let client: SupabaseClient | null = null;
function supabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key || !process.env.SMC_API_SECRET) return null;
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
const secret = () => process.env.SMC_API_SECRET ?? "";
export const storeDriver = () => (supabase() ? "supabase" : "local");

async function rpc<T>(sb: SupabaseClient, fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await sb.rpc(fn, args);
  if (error) throw new Error(`${fn}: ${error.message}`);
  return data as T;
}

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
  const rows = await rpc<{ id: string; data: object; created_at: string }[]>(sb, "smc_list", { p_secret: secret(), p_collection: collection });
  return (rows ?? []).map((r) => ({ ...r.data, id: r.id, createdAt: r.created_at }) as T);
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
  await rpc(sb, "smc_upsert", { p_secret: secret(), p_collection: collection, p_id: id, p_data: data, p_created_at: createdAt ?? null });
}

export async function upsertMany(collection: string, docs: Doc[]) {
  for (const d of docs) await upsert(collection, d);
}

export async function remove(collection: string, id: string) {
  const sb = supabase();
  if (!sb) return writeLocal(collection, (docs) => docs.filter((d) => d.id !== id));
  await rpc(sb, "smc_delete", { p_secret: secret(), p_collection: collection, p_id: id });
}

/** Stores an upload and returns the URL it is served from (/files/<name>). */
export async function saveFile(name: string, bytes: Buffer, contentType: string): Promise<string> {
  const sb = supabase();
  if (!sb) {
    const dir = path.join(DATA_DIR, "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), bytes);
  } else {
    await rpc(sb, "smc_put_file", { p_secret: secret(), p_name: name, p_content_type: contentType, p_base64: bytes.toString("base64") });
  }
  return `/files/${name}`;
}

export async function readFile(name: string): Promise<Buffer | null> {
  if (!/^[\w-]+\.(pdf|jpg|png|webp)$/.test(name)) return null;
  const sb = supabase();
  try {
    if (!sb) return await fs.readFile(path.join(DATA_DIR, "uploads", name));
    const rows = await rpc<{ base64: string }[]>(sb, "smc_get_file", { p_name: name });
    return rows?.[0] ? Buffer.from(rows[0].base64, "base64") : null;
  } catch {
    return null;
  }
}
