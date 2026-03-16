import { auth } from "@/auth";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";

const NEST_URL = process.env.NEST_API_URL ?? "http://localhost:8082";

async function makeServiceToken(userId?: string | null): Promise<string> {
  const rawSecret = process.env.INTERNAL_API_SECRET ?? "";
  if (!rawSecret) {
    throw new Error("INTERNAL_API_SECRET is not configured");
  }

  const secret = new TextEncoder().encode(rawSecret);
  return new SignJWT({ sub: userId ?? undefined })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("60s")
    .sign(secret);
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(req: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let token: string;
  try {
    token = await makeServiceToken(session.user.id);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Token generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const { path } = await params;
  const nestPath = path.join("/");
  const search = new URL(req.url).search;
  const nestUrl = `${NEST_URL}/${nestPath}${search}`;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const contentType = req.headers.get("content-type");
  if (contentType) headers["content-type"] = contentType;

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  let res: Response;
  try {
    res = await fetch(nestUrl, {
      method: req.method,
      headers,
      body: body ? Buffer.from(body) : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { error: "Backend API is unavailable" },
      { status: 503 },
    );
  }

  const responseBody = await res.arrayBuffer();
  return new NextResponse(responseBody, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
};
