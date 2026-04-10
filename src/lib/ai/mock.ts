import type { AiChatRequest, AiChatResponse } from "./types";

function resolveMockPrefix(locale: string): string {
  if (locale.startsWith("ru")) {
    return "Это mock-ответ product assistant.";
  }

  if (locale.startsWith("uk")) {
    return "Це mock-відповідь product assistant.";
  }

  return "This is a mock product assistant response.";
}

function resolveMockGuidance(locale: string): string {
  if (locale.startsWith("ru")) {
    return "На следующем шаге здесь будет вызов реальной модели с опорой на продуктовый контекст, правила советов и ограничения.";
  }

  if (locale.startsWith("uk")) {
    return "На наступному кроці тут буде виклик реальної моделі з опорою на продуктовий контекст, правила порад і обмеження.";
  }

  return "The next step will replace this with a real model call that uses the product context, guidance rules, and limitations.";
}

export function createMockAiChatResponse(
  request: AiChatRequest,
  meta: { provider: string; model: string },
): AiChatResponse {
  const lastUserMessage = [...request.messages].reverse().find((message) => message.role === "user");
  const locale = request.locale.toLowerCase();
  const preview = lastUserMessage?.content.trim() || "";

  return {
    message: {
      role: "assistant",
      content: [
        resolveMockPrefix(locale),
        preview ? `Последний вопрос: "${preview}".` : undefined,
        resolveMockGuidance(locale),
      ]
        .filter(Boolean)
        .join(" "),
    },
    meta: {
      provider: meta.provider,
      model: meta.model,
      finishReason: "stop",
      assistantMode: request.assistantMode,
      contextScope: request.contextScope,
      isMock: true,
    },
  };
}
