import { auth } from "@/auth";
import { resolveAiRuntimeConfig } from "@/lib/ai/config";
import { buildAiVerifiedRuntimeContext } from "@/lib/ai/dashboard-context";
import { buildAiSystemPrompt } from "@/lib/ai/prompt";
import { AiProviderError, generateAiChatResponse } from "@/lib/ai/provider";
import { consumeAiRateLimit } from "@/lib/ai/rate-limit";
import { aiChatRequestSchema } from "@/lib/ai/types";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function resolveProviderErrorMessage(locale: string, error: AiProviderError): string {
  const normalizedLocale = locale.toLowerCase();

  if (error.code === "quota_exceeded") {
    if (normalizedLocale.startsWith("ru")) {
      return "Лимит Gemini для этого проекта сейчас исчерпан. Проверьте billing и квоты в Google AI Studio или временно переключите AI_MODE обратно на mock.";
    }

    if (normalizedLocale.startsWith("uk")) {
      return "Ліміт Gemini для цього проєкту зараз вичерпано. Перевірте billing і квоти в Google AI Studio або тимчасово поверніть AI_MODE у mock.";
    }

    return "The Gemini quota for this project is currently exhausted. Check billing and quota settings in Google AI Studio, or temporarily switch AI_MODE back to mock.";
  }

  if (error.code === "misconfigured") {
    if (normalizedLocale.startsWith("ru")) {
      return "AI-провайдер настроен некорректно. Проверьте AI_MODE, AI_PROVIDER, AI_MODEL и AI_API_KEY в локальном .env.";
    }

    if (normalizedLocale.startsWith("uk")) {
      return "AI-провайдер налаштований некоректно. Перевірте AI_MODE, AI_PROVIDER, AI_MODEL і AI_API_KEY у локальному .env.";
    }

    return "The AI provider is misconfigured. Check AI_MODE, AI_PROVIDER, AI_MODEL, and AI_API_KEY in your local .env.";
  }

  return error.message;
}

export async function POST(req: Request): Promise<NextResponse> {
  const config = resolveAiRuntimeConfig();
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  const clientIdentifier = forwardedFor || realIp || "unknown";
  let rateLimitKey = `ip:${clientIdentifier}`;
  let session: Awaited<ReturnType<typeof auth>> | null = null;

  if (config.requireAuth) {
    session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    rateLimitKey = `user:${session.user.id}`;
  }

  const rateLimitResult = consumeAiRateLimit({
    key: rateLimitKey,
    ttlMs: config.rateLimitTtlMs,
    maxRequests: config.rateLimitMaxRequests,
  });

  if (rateLimitResult.limited) {
    return NextResponse.json(
      { error: "Too many AI chat requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
        },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsedRequest = aiChatRequestSchema.safeParse(payload);
  if (!parsedRequest.success) {
    return NextResponse.json(
      {
        error: "Invalid AI chat request",
        details: parsedRequest.error.flatten(),
      },
      { status: 400 },
    );
  }

  const aiRequest = parsedRequest.data;
  let systemPrompt: string;
  let verifiedRuntimeContext: string | null = null;

  if (session?.user?.id && aiRequest.runtimeContext) {
    try {
      verifiedRuntimeContext = await buildAiVerifiedRuntimeContext({
        userId: session.user.id,
        runtimeContext: aiRequest.runtimeContext,
      });
    } catch {
      verifiedRuntimeContext = null;
    }
  }

  try {
    systemPrompt = await buildAiSystemPrompt({
      locale: aiRequest.locale,
      assistantMode: aiRequest.assistantMode,
      contextScope: aiRequest.contextScope,
      verifiedRuntimeContext,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI context is unavailable";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  let response;
  try {
    response = await generateAiChatResponse({
      request: aiRequest,
      systemPrompt,
      config,
    });
  } catch (error) {
    if (error instanceof AiProviderError) {
      return NextResponse.json(
        { error: resolveProviderErrorMessage(aiRequest.locale, error) },
        { status: error.statusCode },
      );
    }

    const message = error instanceof Error ? error.message : "AI provider request failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json(response, { status: 200 });
}
