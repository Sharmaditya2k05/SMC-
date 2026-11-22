import { connection } from "next/server";
import { list, storeDriver } from "@/lib/store";

/**
 * GET /api/keepalive
 * Free Supabase projects pause after about a week without database activity,
 * which would leave the site without its notes, settings and uploads. Vercel
 * calls this once a day (see "crons" in vercel.json) and it makes one small
 * database call, so the project always counts as active.
 *
 * Returns nothing from the database. If CRON_SECRET is set in Vercel, Vercel
 * sends it as a bearer token and anything else is refused.
 */
export async function GET(request: Request) {
  await connection(); // run on every call, never prerendered at build time
  const headers = { "Cache-Control": "no-store" };
  const secret = (process.env.CRON_SECRET ?? "").trim();
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401, headers });
  }
  if (storeDriver() !== "supabase") return Response.json({ ok: true, driver: "local" }, { headers });
  try {
    await list("site");
    return Response.json({ ok: true }, { headers });
  } catch (error) {
    console.error("keepalive failed", error instanceof Error ? error.message : "unknown");
    return Response.json({ ok: false }, { status: 503, headers });
  }
}
