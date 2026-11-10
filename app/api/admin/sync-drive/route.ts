import { revalidateTag } from "next/cache";
import { guard } from "@/lib/auth";
import { CONTENT_TAG } from "@/lib/content";
import { DEFAULT_SETTINGS } from "@/lib/defaults";
import { crawlDrive, driveFileToResource, folderIdFromUrl } from "@/lib/drive";
import { list, upsertMany } from "@/lib/store";

/** Imports PDFs from the public Drive folder that are not in the library yet. */
export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;

  const site = await list("site");
  const url = String(site.find((d) => d.id === "settings")?.driveFolderUrl ?? DEFAULT_SETTINGS.driveFolderUrl);
  const folderId = folderIdFromUrl(url);
  if (!folderId) return Response.json({ error: "Set a Google Drive folder link in Website settings first." }, { status: 422 });

  try {
    const files = await crawlDrive(folderId);
    const have = new Set((await list("resources")).map((r) => r.driveId));
    const now = Date.now();
    const fresh = files
      .filter((f) => !have.has(f.id))
      .map((f, i) => driveFileToResource(f, new Date(now - i * 1000).toISOString()))
      .filter((r): r is NonNullable<typeof r> => !!r)
      // imported files start hidden; the teacher chooses which ones to publish
      .map((r) => ({ ...r, published: false }));
    await upsertMany("resources", fresh);
    revalidateTag(CONTENT_TAG, "max");
    return Response.json({ added: fresh.length, found: files.length });
  } catch (e) {
    console.error("[sync-drive]", e);
    return Response.json(
      { error: "Could not read the Drive folder. Make sure it is shared as 'Anyone with the link'." },
      { status: 502 },
    );
  }
}
