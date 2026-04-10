import type { AiChatMessage, AiChatResponse, AiChatRuntimeContext } from "./types";

type SendAiChatRequestInput = {
  messages: AiChatMessage[];
  locale: string;
  runtimeContext?: AiChatRuntimeContext;
  signal?: AbortSignal;
};

export async function sendAiChatRequest(input: SendAiChatRequestInput): Promise<AiChatResponse> {
  const response = await fetch("/api/ai/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: input.messages,
      locale: input.locale,
      assistantMode: "product",
      contextScope: ["product", "guidance", "limitations"],
      runtimeContext: input.runtimeContext,
    }),
    signal: input.signal,
  });

  const payload = (await response.json().catch(() => null)) as
    | AiChatResponse
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(payload && "error" in payload && payload.error ? payload.error : "AI chat request failed");
  }

  if (!payload || !("message" in payload) || !("meta" in payload)) {
    throw new Error("AI chat response is invalid");
  }

  return payload;
}
