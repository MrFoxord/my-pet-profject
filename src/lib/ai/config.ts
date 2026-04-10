import "server-only";

export type AiRuntimeConfig = {
  mode: "mock" | "provider";
  provider: string;
  model: string;
  apiKey: string | null;
  timeoutMs: number;
  requireAuth: boolean;
  rateLimitTtlMs: number;
  rateLimitMaxRequests: number;
};

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function resolveAiRuntimeConfig(): AiRuntimeConfig {
  const mode = process.env.AI_MODE === "provider" ? "provider" : "mock";

  return {
    mode,
    provider: process.env.AI_PROVIDER?.trim() || "mock",
    model: process.env.AI_MODEL?.trim() || "mock-product-assistant",
    apiKey: process.env.AI_API_KEY?.trim() || null,
    timeoutMs: parsePositiveInt(process.env.AI_TIMEOUT_MS, 15000),
    requireAuth: process.env.AI_REQUIRE_AUTH !== "false",
    rateLimitTtlMs: parsePositiveInt(process.env.AI_RATE_LIMIT_TTL_MS, 60000),
    rateLimitMaxRequests: parsePositiveInt(process.env.AI_RATE_LIMIT_MAX_REQUESTS, 30),
  };
}
