import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "smc_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function authConfigured() {
  return Boolean(
    process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH && (process.env.SESSION_SECRET ?? "").length >= 32,
  );
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

const sign = (payload: string) =>
  createHmac("sha256", process.env.SESSION_SECRET ?? "").update(payload).digest("base64url");

export function createSession() {
  const payload = Buffer.from(JSON.stringify({ exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  return { value: `${payload}.${sign(payload)}`, maxAge: MAX_AGE };
}

export function verifySession(token: string | undefined | null) {
  if (!token || !authConfigured()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).exp > Date.now();
  } catch {
    return false;
  }
}

export function sessionFromRequest(req: Request) {
  const cookies = (req.headers.get("cookie") ?? "").split(/;\s*/);
  const mine = cookies.find((c) => c.startsWith(SESSION_COOKIE + "="));
  return verifySession(mine?.slice(SESSION_COOKIE.length + 1));
}

/** Returns a 401 response when the request is not from the signed-in admin. */
export function guard(req: Request) {
  return sessionFromRequest(req) ? null : Response.json({ error: "Not signed in." }, { status: 401 });
}

export function cookieHeader(value: string, maxAge: number) {
  const secure = process.env.NODE_ENV === "production" ? " Secure;" : "";
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax;${secure} Max-Age=${maxAge}`;
}

/* In-memory throttle: `limit` attempts per 10 minutes per key. */
const attempts = new Map<string, { n: number; reset: number }>();
export function throttled(key: string, limit = 5) {
  const now = Date.now();
  const a = attempts.get(key);
  if (!a || a.reset < now) {
    attempts.set(key, { n: 1, reset: now + 10 * 60_000 });
    return false;
  }
  a.n += 1;
  return a.n > limit;
}

export function clientKey(req: Request) {
  return (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();
}
