import "server-only";

import { getAiContextBundle } from "./context";
import type { AiAssistantMode, AiContextScope } from "./types";

function resolveLocaleInstruction(locale: string): string {
  if (locale.startsWith("ru")) {
    return "Respond in Russian unless the user clearly asks for another language.";
  }

  if (locale.startsWith("uk")) {
    return "Respond in Ukrainian unless the user clearly asks for another language.";
  }

  return "Respond in English unless the user clearly asks for another language.";
}

function resolveAssistantModeInstruction(assistantMode: AiAssistantMode): string {
  if (assistantMode === "product") {
    return [
      "You are an in-product assistant.",
      "You explain product functionality, help the user choose between available options, and stay within the provided product context.",
      "Do not pretend to inspect source code or runtime state unless that information is explicitly supplied.",
      "Do not wrap product role names, invite types, permission names, or UI terms in backticks unless the user explicitly asks for technical formatting.",
    ].join(" ");
  }

  return "You are a product assistant.";
}

export async function buildAiSystemPrompt(input: {
  locale: string;
  assistantMode: AiAssistantMode;
  contextScope: AiContextScope[];
  verifiedRuntimeContext?: string | null;
}): Promise<string> {
  const contextBundle = await getAiContextBundle(input.contextScope);

  return [
    resolveAssistantModeInstruction(input.assistantMode),
    resolveLocaleInstruction(input.locale.toLowerCase()),
    "Use the provided context as the source of truth. If the context does not confirm something, say that directly instead of inventing details.",
    input.verifiedRuntimeContext
      ? [
          "If verified dashboard runtime context is provided, treat it as the current source of truth for the active board and section.",
          "Use it to tailor navigation and recommendations, but do not infer hidden fields that are not explicitly listed.",
          `## Verified Runtime Context\n\n${input.verifiedRuntimeContext}`,
        ].join("\n\n")
      : undefined,
    contextBundle,
  ].join("\n\n");
}
