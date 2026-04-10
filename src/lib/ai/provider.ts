import "server-only";

import type { AiRuntimeConfig } from "./config";
import type { AiChatRequest, AiChatResponse } from "./types";

export class AiProviderError extends Error {
  constructor(
    message: string,
    public readonly code: "quota_exceeded" | "misconfigured" | "provider_error",
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AiProviderError";
  }
}

type GenerateAiChatResponseInput = {
  request: AiChatRequest;
  systemPrompt: string;
  config: AiRuntimeConfig;
};

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
    finishReason?: string;
  }>;
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    message?: string;
  };
};

function mapAiMessageRoleToGeminiRole(role: AiChatRequest["messages"][number]["role"]): "user" | "model" {
  return role === "assistant" ? "model" : "user";
}

function mapGeminiFinishReason(finishReason?: string): AiChatResponse["meta"]["finishReason"] {
  if (!finishReason) {
    return "stop";
  }

  if (finishReason === "MAX_TOKENS") {
    return "length";
  }

  if (finishReason === "STOP") {
    return "stop";
  }

  return "error";
}

function extractGeminiText(response: GeminiGenerateContentResponse): string {
  const candidate = response.candidates?.[0];
  const text = candidate?.content?.parts
    ?.map((part) => part.text ?? "")
    .join("")
    .trim();

  if (text) {
    return text;
  }

  if (response.promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked the request: ${response.promptFeedback.blockReason}`);
  }

  if (response.error?.message) {
    throw new Error(response.error.message);
  }

  throw new Error("Gemini returned an empty response");
}

function createGeminiError(responseStatus: number, message: string): AiProviderError {
  const normalizedMessage = message.toLowerCase();

  if (
    responseStatus === 429 ||
    normalizedMessage.includes("quota exceeded") ||
    normalizedMessage.includes("rate limit") ||
    normalizedMessage.includes("billing details")
  ) {
    return new AiProviderError(message, "quota_exceeded", 429);
  }

  return new AiProviderError(message, "provider_error", responseStatus >= 400 ? responseStatus : 502);
}

async function generateWithGoogle(input: GenerateAiChatResponseInput): Promise<AiChatResponse> {
  if (!input.config.apiKey) {
    throw new AiProviderError("AI_API_KEY is not configured", "misconfigured", 500);
  }

  const endpoint = new URL(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(input.config.model)}:generateContent`,
  );
  endpoint.searchParams.set("key", input.config.apiKey);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: input.systemPrompt }],
      },
      contents: input.request.messages.map((message) => ({
        role: mapAiMessageRoleToGeminiRole(message.role),
        parts: [{ text: message.content }],
      })),
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 700,
      },
    }),
    signal: AbortSignal.timeout(input.config.timeoutMs),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as GeminiGenerateContentResponse | null;

  if (!response.ok) {
    const message = payload?.error?.message || `Gemini request failed with status ${response.status}`;
    throw createGeminiError(response.status, message);
  }

  const content = extractGeminiText(payload ?? {});
  const finishReason = mapGeminiFinishReason(payload?.candidates?.[0]?.finishReason);

  return {
    message: {
      role: "assistant",
      content,
    },
    meta: {
      provider: input.config.provider,
      model: input.config.model,
      finishReason,
      assistantMode: input.request.assistantMode,
      contextScope: input.request.contextScope,
      isMock: false,
    },
  };
}

export async function generateAiChatResponse(input: GenerateAiChatResponseInput): Promise<AiChatResponse> {
  if (input.config.mode === "mock") {
    const { createMockAiChatResponse } = await import("./mock");

    return createMockAiChatResponse(input.request, {
      provider: input.config.provider,
      model: input.config.model,
    });
  }

  if (input.config.provider === "google") {
    return generateWithGoogle(input);
  }

  throw new AiProviderError(`Unsupported AI provider: ${input.config.provider}`, "misconfigured", 500);
}
