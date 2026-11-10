import { readLocalFile } from "@/lib/store";

const MIME: Record<string, string> = {
  pdf: "application/pdf", jpg: "image/jpeg", png: "image/png", webp: "image/webp",
};

/** Serves files uploaded with the local (development) storage driver. */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const bytes = await readLocalFile(name);
  if (!bytes) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(bytes), {
    headers: {
      "Content-Type": MIME[name.split(".").pop() ?? ""] ?? "application/octet-stream",
      "Content-Disposition": "inline",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
