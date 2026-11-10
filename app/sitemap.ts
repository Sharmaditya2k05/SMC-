import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const PAGES = ["", "/about", "/courses", "/timetable", "/study-material", "/methodology", "/results", "/gallery", "/contact", "/faqs", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: p === "/study-material" || p === "/timetable" ? "weekly" : "monthly",
    priority: p === "" ? 1 : ["/courses", "/timetable", "/study-material", "/contact"].includes(p) ? 0.8 : 0.5,
  }));
}
