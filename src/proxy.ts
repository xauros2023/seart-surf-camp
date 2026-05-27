import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const authCookie = request.cookies.get(ADMIN_COOKIE_NAME);
    if (!(await verifyAdminSessionToken(authCookie?.value))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
