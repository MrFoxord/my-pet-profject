import { NextResponse } from "next/server";
import { auth } from "@/auth";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 40;

const middlewareRateStore =
  (globalThis as typeof globalThis & {
    __middlewareRateStore?: Map<string, { count: number; windowStart: number }>;
  }).__middlewareRateStore ?? new Map<string, { count: number; windowStart: number }>();

(globalThis as typeof globalThis & {
  __middlewareRateStore?: Map<string, { count: number; windowStart: number }>;
}).__middlewareRateStore = middlewareRateStore;

function getClientIdentifier(request: Parameters<Parameters<typeof auth>[0]>[0]) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "unknown";
}

function exceedsRateLimit(key: string): boolean {
  const now = Date.now();
  const current = middlewareRateStore.get(key);

  if (!current || now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
    middlewareRateStore.set(key, { count: 1, windowStart: now });
    return false;
  }

  current.count += 1;
  middlewareRateStore.set(key, current);
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

export default auth((request) => {
  const isAuthenticated = Boolean(request.auth);
  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/auth");
  const isProtectedRoute =
    pathname.startsWith("/boards") ||
    pathname.startsWith("/dashboard");

  const isSensitiveRoute = pathname.startsWith("/auth") || pathname.startsWith("/invite");
  if (isSensitiveRoute) {
    const key = `${getClientIdentifier(request)}:${pathname}`;
    if (exceedsRateLimit(key)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429, headers: { "Retry-After": "60" } },
      );
    }
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/boards", request.url));
  }

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/boards/:path*", "/dashboard/:path*", "/auth/:path*", "/invite/:path*"],
};
