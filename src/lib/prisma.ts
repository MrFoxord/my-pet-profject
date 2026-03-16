import "server-only";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma/client";

type AppPrismaClient = InstanceType<typeof PrismaClient>;

declare global {
  var __appPrismaClient: AppPrismaClient | undefined;
  var __appPrismaPool: Pool | undefined;
}

function normalizeDatabaseUrl(raw: string): string {
  const parsed = new URL(raw);
  parsed.searchParams.delete("schema");

  if (
    !parsed.searchParams.has("sslmode") &&
    ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname)
  ) {
    parsed.searchParams.set("sslmode", "disable");
  }

  return parsed.toString();
}

function createPrismaClient(): AppPrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set");
  }

  const pool =
    globalThis.__appPrismaPool ??
    new Pool({ connectionString: normalizeDatabaseUrl(databaseUrl) });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__appPrismaPool = pool;
  }

  return new PrismaClient({
    adapter: new PrismaPg(pool),
  } as never) as AppPrismaClient;
}

export const prisma =
  globalThis.__appPrismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__appPrismaClient = prisma;
}
