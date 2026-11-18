import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value;
  const userRole = request.cookies.get("auth_user_role")?.value?.toLowerCase();
  const { pathname } = request.nextUrl;

  // Root route: redirect based on auth status
  if (pathname === "/") {
    if (authToken) {
      const dashboardUrl = new URL("/dashboard/ecommerce", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!authToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based route protection: Admin-only routes
    if (pathname.startsWith("/dashboard/users")) {
      if (userRole !== "admin") {
        const unauthorizedUrl = new URL("/unauthorized", request.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  // Redirect authenticated user away from /login to dashboard
  if (pathname === "/login") {
    if (authToken) {
      const dashboardUrl = new URL("/dashboard/ecommerce", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
