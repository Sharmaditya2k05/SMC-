import { clientKey, guard, throttled } from "@/lib/auth";
import { passwordIsCorrect, setPassword } from "@/lib/auth-store";

/** Change the admin password. Requires a signed-in session and the current password. */
export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  if (throttled("pw:" + clientKey(req)))
    return Response.json({ error: "Too many attempts. Try again in 10 minutes." }, { status: 429 });

  const { current = "", next = "" } = await req.json().catch(() => ({}));
  if (typeof next !== "string" || next.length < 8)
    return Response.json({ error: "The new password must be at least 8 characters." }, { status: 422 });
  if (next.length > 200) return Response.json({ error: "The new password is too long." }, { status: 422 });
  if (!(await passwordIsCorrect(String(current))))
    return Response.json({ error: "The current password is not correct." }, { status: 401 });

  try {
    await setPassword(next);
  } catch (e) {
    console.error("[password]", e);
    return Response.json({ error: "The password could not be saved. Please try again." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
