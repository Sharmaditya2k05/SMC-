import { cacheLife, cacheTag } from "next/cache";
import { DEFAULT_SETTINGS, DEFAULT_TIMETABLE } from "./defaults";
import { list } from "./store";
import type { Achievement, Announcement, GalleryImage, Resource, Settings, Testimonial, Timetable } from "./types";

/** One tag for all public content; every admin write revalidates it. */
export const CONTENT_TAG = "content";

async function safeList<T>(collection: string): Promise<T[]> {
  try {
    return (await list(collection)) as unknown as T[];
  } catch (e) {
    console.error(`[store] could not read ${collection}:`, e);
    return [];
  }
}
const newest = <T extends { createdAt: string }>(a: T[]) =>
  [...a].sort((x, y) => (y.createdAt ?? "").localeCompare(x.createdAt ?? ""));

export async function getSettings(): Promise<Settings> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const site = await safeList<{ id: string }>("site");
  const saved = (site.find((d) => d.id === "settings") ?? {}) as Partial<Settings>;
  return { ...DEFAULT_SETTINGS, ...saved };
}

export async function getTimetable(): Promise<Timetable> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  const site = await safeList<{ id: string }>("site");
  const saved = site.find((d) => d.id === "timetable") as Partial<Timetable> | undefined;
  return { notice: saved?.notice ?? "", slots: saved?.slots?.length ? saved.slots : DEFAULT_TIMETABLE.slots };
}

export async function getResources(): Promise<Resource[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return newest(await safeList<Resource>("resources")).filter((r) => r.published);
}

export async function getAnnouncements(): Promise<Announcement[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return newest(await safeList<Announcement>("announcements")).filter((a) => a.published);
}

export async function getGallery(): Promise<GalleryImage[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return (await safeList<GalleryImage>("gallery")).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  // only stories the family has agreed to publish
  return newest(await safeList<Testimonial>("testimonials")).filter((t) => t.published && t.permission);
}

export async function getAchievements(): Promise<Achievement[]> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("hours");
  return newest(await safeList<Achievement>("achievements")).filter((a) => a.published);
}

export async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
