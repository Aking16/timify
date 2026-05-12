import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define public routes (accessible without login)
  const publicPaths = ["/login", "/signup"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // 2. Check for the session cookie (This is the "Thin Proxy" check) [citation:9]
  // Better Auth uses two possible cookie names for security [citation:9]
  const sessionCookie =
    request.cookies.get("better-auth.session_token") ||
    request.cookies.get("__Secure-better-auth.session_token");

  const isAuthenticated = !!sessionCookie;

  // 3. Redirect logic
  // Redirect root URL based on auth status
  if (pathname === "/") {
    const target = isAuthenticated ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Redirect unauthenticated users trying to access a protected page [citation:4][citation:5]
  if (!isAuthenticated && !isPublicPath) {
    // You can add a 'from' parameter to redirect them back after login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Optional: Prevent logged-in users from accessing login/signup pages
  // (This prevents a "logged-in" user from seeing the login screen) [citation:9]
  if (isAuthenticated && isPublicPath && pathname !== "/") {
    // If trying to access /login, send them to /dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to proceed [citation:5]
  return NextResponse.next();
}

// Export the config first if using Matcher (Next.js 15) [citation:5][citation:9]
export const config = {
  matcher: ["/((?!api/auth|_next/static|favicon.ico).*)"],
};
