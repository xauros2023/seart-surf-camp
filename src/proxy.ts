import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin paths: bypass i18n, enforce auth
  if (pathname.startsWith("/admin")) {
    if (!pathname.startsWith("/admin/login")) {
      const authCookie = request.cookies.get(ADMIN_COOKIE_NAME);
      if (!(await verifyAdminSessionToken(authCookie?.value))) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    return NextResponse.next();
  }

  // API paths: bypass i18n
  if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Public site: hand off to next-intl for locale detection + rewriting
  return intlMiddleware(request);
}

export const config = {
  // Match every path except API, _next internals, static files (with extensions like .png/.webp/.svg/.ico)
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
