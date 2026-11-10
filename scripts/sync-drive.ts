// Rebuilds data/seed/resources.json from the public Google Drive folder.
// Usage: npm run sync-drive [-- <folder url>]
import { writeFileSync, mkdirSync } from "node:fs";
import { crawlDrive, driveFileToResource, folderIdFromUrl } from "../lib/drive.ts";

const url = process.argv[2] ?? "https://drive.google.com/drive/folders/1-1FSZXIS-XwbuXO9ZGFMaCh_Hd-eA_0Z";
const id = folderIdFromUrl(url);
if (!id) throw new Error("Not a Drive folder URL: " + url);

// Only these are public to begin with; the teacher publishes more from the admin.
const SAMPLES = new Set([
  "XI|Sets – Notes", "XI|Trigonometry – Notes", "XI|Straight Lines – Notes",
  "XII|Matrices – Notes", "XII|Definite Integrals – Notes", "XII|Probability – Notes",
]);

const files = await crawlDrive(id);
const order: Record<string, number> = { XI: 0, XII: 1, JEE: 2 };
const base = Date.UTC(2023, 10, 5);
const seen = new Set<string>();
const resources = files
  .map((f) => driveFileToResource(f, ""))
  .filter((r): r is NonNullable<typeof r> => !!r)
  .sort((a, b) => order[a.cls] - order[b.cls] || a.chapter.localeCompare(b.chapter, "en", { numeric: true }))
  .filter((r) => (seen.has(r.cls + r.title) ? false : (seen.add(r.cls + r.title), true)))
  .map((r, i, all) => ({ ...r, published: SAMPLES.has(r.cls + "|" + r.title), createdAt: new Date(base + (all.length - i) * 60000).toISOString() }));

mkdirSync("data/seed", { recursive: true });
writeFileSync("data/seed/resources.json", JSON.stringify(resources, null, 2));
console.log(`Wrote ${resources.length} resources to data/seed/resources.json`);
