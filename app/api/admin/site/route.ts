import { revalidateTag } from "next/cache";
import { guard } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";
import { DAYS, DEFAULT_SETTINGS, DEFAULT_TIMETABLE } from "@/lib/defaults";
import { list, storeDriver, upsert } from "@/lib/store";
import type { Settings, Slot, Timetable } from "@/lib/types";

/** Website settings and timetable (two single documents). */
export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const site = await list("site");
  const settings = { ...DEFAULT_SETTINGS, ...(site.find((d) => d.id === "settings") ?? {}) };
  const saved = site.find((d) => d.id === "timetable") as Partial<Timetable> | undefined;
  const timetable = { notice: saved?.notice ?? "", slots: saved?.slots?.length ? saved.slots : DEFAULT_TIMETABLE.slots };
  return Response.json({ settings, timetable, driver: storeDriver() });
}

const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function PUT(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = await req.json().catch(() => ({}));

  if (body.settings) {
    const clean: Record<string, unknown> = { id: "settings" };
    for (const key of Object.keys(DEFAULT_SETTINGS) as (keyof Settings)[]) {
      const v = body.settings[key];
      if (v === undefined) continue;
      clean[key] = typeof DEFAULT_SETTINGS[key] === "boolean" ? Boolean(v) : String(v).trim().slice(0, 6000);
    }
    for (const key of ["mapsUrl", "mapsEmbedUrl", "driveFolderUrl", "instagram", "youtube", "facebook"]) {
      const v = clean[key];
      if (typeof v === "string" && v && !v.startsWith("https://"))
        return Response.json({ error: `${key} must be a link starting with https://` }, { status: 422 });
    }
    await upsert("site", clean as { id: string });
  }

  if (body.timetable) {
    const slots: Slot[] = [];
    for (const s of (body.timetable.slots ?? []) as Slot[]) {
      const days = (s.days ?? []).filter((d) => (DAYS as readonly string[]).includes(d));
      if (!["XI", "XII"].includes(s.cls) || !days.length || !TIME.test(s.start) || !TIME.test(s.end) || s.end <= s.start)
        return Response.json({ error: "Each batch needs a class, at least one day, and an end time after its start time." }, { status: 422 });
      slots.push({ id: String(s.id || crypto.randomUUID()), cls: s.cls, days, start: s.start, end: s.end });
    }
    await upsert("site", { id: "timetable", slots, notice: String(body.timetable.notice ?? "").trim().slice(0, 500) });
  }

  revalidateTag(CONTENT_TAG, "max");
  return Response.json({ ok: true });
}
