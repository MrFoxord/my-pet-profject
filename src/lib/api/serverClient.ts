import { SignJWT } from "jose";
import type { Ticket } from "@/types";
import { ApiBoardResponse } from "./client";

const NEST_URL = process.env.NEST_API_URL ?? "http://localhost:8082";

async function makeServiceToken(userId?: string | null): Promise<string> {
  const secret = new TextEncoder().encode(
    process.env.INTERNAL_API_SECRET ?? ""
  );
  return new SignJWT({ sub: userId ?? undefined })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("60s")
    .sign(secret);
}

/**
 * Server-side only. Calls Nest directly with a signed service JWT.
 * Use this in Server Components instead of client.ts functions.
 */
export async function getServerBoardById(
  boardId: string,
  userId?: string | null,
  options?: { ticketsOffset?: number; ticketsLimit?: number },
): Promise<ApiBoardResponse | null> {
  const token = await makeServiceToken(userId);
  const endpoint = new URL(`${NEST_URL}/boards/${boardId}`);

  if (typeof options?.ticketsOffset === "number") {
    endpoint.searchParams.set("ticketsOffset", String(options.ticketsOffset));
  }

  if (typeof options?.ticketsLimit === "number") {
    endpoint.searchParams.set("ticketsLimit", String(options.ticketsLimit));
  }

  const res = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load board: ${res.status}`);
  }

  return res.json() as Promise<ApiBoardResponse>;
}

export async function getServerBoardTicketById(
  boardId: string,
  ticketId: string,
  userId?: string | null,
): Promise<Ticket | null> {
  const token = await makeServiceToken(userId);

  const res = await fetch(`${NEST_URL}/boards/${boardId}/tickets/${ticketId}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (res.status === 400 || res.status === 403 || res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to load ticket: ${res.status}`);
  }

  return res.json() as Promise<Ticket>;
}
