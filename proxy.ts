import { NextRequest, NextResponse } from "next/server";

import { SESSION_FLAG_COOKIE } from "@/config/constants";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/tasks",
  "/categories",
  "/tags",
  "/calendar",
  "/profile",
  "/admin",
];

const AUTH_ONLY_WHEN_LOGGED_OUT = ["/login", "/register", "/password/reset"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.get(SESSION_FLAG_COOKIE)?.value === "1";

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && AUTH_ONLY_WHEN_LOGGED_OUT.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/categories/:path*",
    "/tags/:path*",
    "/calendar/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/password/reset",
  ],
};
