import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginRoute = request.nextUrl.pathname === "/login";

  // If accessing dashboard without token, redirect to login
  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If accessing login with token, redirect to dashboard
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};

