/**
 * Reads a *publicly shared* Google Drive folder without credentials, using
 * Drive's embedded folder view. Only files that anyone with the link can
 * already see are returned, so nothing private can be exposed.
 *
 * This is a best-effort reader (Google can change the markup). For a
 * guaranteed integration, swap `listFolder` for the Drive API with a
 * server-side key.
 */

export type DriveFile = { id: string; name: string; path: string[] };

const ENTRY =
  /href="https:\/\/drive\.google\.com\/(drive\/folders\/|file\/d\/)([\w-]+)[^"]*"[\s\S]*?flip-entry-title">([^<]*)</g;

function decode(s: string) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

async function listFolder(id: string) {
  const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${id}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Drive folder ${id} returned ${res.status}`);
  const html = await res.text();
  const out: { kind: "folder" | "file"; id: string; name: string }[] = [];
  for (const m of html.matchAll(ENTRY)) {
    out.push({ kind: m[1].startsWith("drive") ? "folder" : "file", id: m[2], name: decode(m[3]) });
  }
  return out;
}

export function folderIdFromUrl(url: string) {
  return url.match(/folders\/([\w-]+)/)?.[1] ?? null;
}

export async function crawlDrive(rootId: string, maxDepth = 4): Promise<DriveFile[]> {
  const files: DriveFile[] = [];
  async function walk(id: string, path: string[], depth: number) {
    const entries = await listFolder(id);
    const folders = entries.filter((e) => e.kind === "folder");
    for (const e of entries) if (e.kind === "file") files.push({ id: e.id, name: e.name, path });
    if (depth >= maxDepth) return;
    // small batches keep us polite to Drive
    for (let i = 0; i < folders.length; i += 4) {
      await Promise.all(
        folders.slice(i, i + 4).map((f) => walk(f.id, [...path, f.name], depth + 1)),
      );
    }
  }
  await walk(rootId, [], 0);
  return files;
}

/* ---------- mapping Drive files to library resources ---------- */

const XII_CHAPTERS = [
  "Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants",
  "Continuity and Differentiability", "Applications of Derivatives", "Integrals",
  "Applications of Integrals", "Differential Equations", "Vector Algebra",
  "Three-Dimensional Geometry", "Linear Programming", "Probability",
];
const KEEP_UPPER = new Set(["XI", "XII", "JEE", "3D"]);
const EXPAND: Record<string, string> = {
  AOD: "Applications of Derivatives",
  AOI: "Applications of Integrals",
};

function titleCase(s: string) {
  return s
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => {
      const u = w.toUpperCase();
      if (EXPAND[u]) return EXPAND[u];
      if (KEEP_UPPER.has(u) || w === "&") return u;
      return u[0] + u.slice(1).toLowerCase();
    })
    .join(" ");
}

function clean(name: string) {
  return name
    .replace(/\.pdf$/i, "")
    .replace(/\(\d+\)/g, "")
    .replace(/\bCH\s*-?\s*\d+\b/gi, "")
    .replace(/\b(XII|XI|JEE|NOTES|20\d\d)\b/gi, "")
    .replace(/\b3\s+D\b/gi, "3D")
    .replace(/\s+/g, " ")
    .trim();
}

export function driveFileToResource(f: DriveFile, createdAt: string) {
  const top = (f.path[0] ?? "").toUpperCase();
  const cls = top.includes("XII") ? "XII" : top.includes("XI") ? "XI" : top.includes("JEE") ? "JEE" : null;
  if (!cls || !/\.pdf$/i.test(f.name)) return null;

  const folder = f.path[1] ?? "";
  const num = Number(folder.match(/CH\s*-?\s*(\d+)/i)?.[1] ?? f.name.match(/CH\s*-?\s*(\d+)/i)?.[1] ?? 0);
  const fromFile = titleCase(clean(f.name));
  const fromFolder = titleCase(clean(folder));
  const chapter = (cls === "XII" && num ? XII_CHAPTERS[num - 1] : fromFolder) || fromFile || "Mathematics";
  const title = fromFile || chapter;

  return {
    id: `drive-${f.id}`,
    title: cls === "JEE" ? `${title} – JEE Notes` : `${title} – Notes`,
    cls,
    chapter: num && cls !== "JEE" ? `Chapter ${num} · ${chapter}` : chapter,
    category: "Chapter-wise Notes",
    description: "",
    driveId: f.id,
    published: true,
    createdAt,
  };
}
