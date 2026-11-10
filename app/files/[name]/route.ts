import { readFile } from "@/lib/store";

const MIME: Record<string, string> = {
  pdf: "application/pdf", jpg: "image/jpeg", png: "image/png", webp: "image/webp",
};

/** Serves uploaded PDFs and photographs. Names are random and never reused, so responses cache forever. */
export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const bytes = await readFile(name);
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
