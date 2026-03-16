import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((request) => {
  const isAuthenticated = Boolean(request.auth);
  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute =
    pathname.startsWith("/boards") || pathname.startsWith("/dashboard");

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/boards", request.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/boards/:path*", "/dashboard/:path*", "/auth/:path*"],
};
