import "server-only";

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const aiRateLimitStore =
  (globalThis as typeof globalThis & {
    __aiRateLimitStore?: Map<string, RateLimitEntry>;
  }).__aiRateLimitStore ?? new Map<string, RateLimitEntry>();

(globalThis as typeof globalThis & {
  __aiRateLimitStore?: Map<string, RateLimitEntry>;
}).__aiRateLimitStore = aiRateLimitStore;

export function consumeAiRateLimit(input: {
  key: string;
  ttlMs: number;
  maxRequests: number;
}): { limited: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const current = aiRateLimitStore.get(input.key);

  if (!current || now - current.windowStart > input.ttlMs) {
    aiRateLimitStore.set(input.key, { count: 1, windowStart: now });
    return {
      limited: false,
      retryAfterSeconds: Math.ceil(input.ttlMs / 1000),
    };
  }

  current.count += 1;
  aiRateLimitStore.set(input.key, current);

  return {
    limited: current.count > input.maxRequests,
    retryAfterSeconds: Math.max(1, Math.ceil((input.ttlMs - (now - current.windowStart)) / 1000)),
  };
}