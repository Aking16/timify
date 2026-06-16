import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

import { defaultRoutes } from "./constants/routes";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isAuthPage = pathname.startsWith(defaultRoutes.authPage);

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL(defaultRoutes.authRedirectPage, request.url));
  }

  if (!session) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app:path*", "/auth:path*"],
};
