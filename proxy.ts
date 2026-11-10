import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

/** Keeps visitors out of /admin. The admin API checks the session again on every call. */
export function proxy(req: NextRequest) {
  const signedIn = verifySession(req.cookies.get(SESSION_COOKIE)?.value);
  const onLogin = req.nextUrl.pathname === "/admin/login";
  if (!signedIn && !onLogin) return NextResponse.redirect(new URL("/admin/login", req.url));
  if (signedIn && onLogin) return NextResponse.redirect(new URL("/admin", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
