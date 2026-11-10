import {
  authConfigured, clientKey, cookieHeader, createSession, sessionFromRequest, throttled, verifyCredentials,
} from "@/lib/auth";

/** GET: am I signed in?  POST: sign in.  DELETE: sign out. */
export async function GET(req: Request) {
  return Response.json({ signedIn: sessionFromRequest(req), configured: authConfigured() });
}

export async function POST(req: Request) {
  if (!authConfigured())
    return Response.json(
      { error: "Admin sign-in is not set up yet. Add ADMIN_USERNAME, ADMIN_PASSWORD_HASH and SESSION_SECRET (see README)." },
      { status: 503 },
    );
  if (throttled("login:" + clientKey(req)))
    return Response.json({ error: "Too many attempts. Try again in 10 minutes." }, { status: 429 });

  const { username = "", password = "" } = await req.json().catch(() => ({}));
  if (!verifyCredentials(String(username), String(password)))
    return Response.json({ error: "Incorrect username or password." }, { status: 401 });

  const s = createSession();
  return Response.json({ ok: true }, { headers: { "Set-Cookie": cookieHeader(s.value, s.maxAge) } });
}

export async function DELETE() {
  return Response.json({ ok: true }, { headers: { "Set-Cookie": cookieHeader("", 0) } });
}
