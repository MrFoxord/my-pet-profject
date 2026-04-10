import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { AI_CONTEXT_SCOPES, type AiContextScope } from "./types";

const AI_CONTEXT_FILE_PATHS: Record<AiContextScope, string> = {
  product: path.join(process.cwd(), "docs", "AI_PRODUCT_CONTEXT.md"),
  guidance: path.join(process.cwd(), "docs", "AI_GUIDANCE_RULES.md"),
  limitations: path.join(process.cwd(), "docs", "AI_LIMITATIONS.md"),
};

const AI_CONTEXT_SECTION_TITLES: Record<AiContextScope, string> = {
  product: "Product Context",
  guidance: "Guidance Rules",
  limitations: "Hard Limitations",
};

const contextCache = new Map<AiContextScope, string>();

async function loadAiContextFile(scope: AiContextScope): Promise<string> {
  const cached = contextCache.get(scope);
  if (cached) {
    return cached;
  }

  const fileContents = await readFile(AI_CONTEXT_FILE_PATHS[scope], "utf8");
  contextCache.set(scope, fileContents);
  return fileContents;
}

export async function getAiContextSections(scopes: AiContextScope[]): Promise<Array<{ scope: AiContextScope; title: string; content: string }>> {
  const normalizedScopes = Array.from(new Set(scopes)).filter((scope): scope is AiContextScope =>
    AI_CONTEXT_SCOPES.includes(scope),
  );

  const contents = await Promise.all(normalizedScopes.map(async (scope) => ({
    scope,
    title: AI_CONTEXT_SECTION_TITLES[scope],
    content: await loadAiContextFile(scope),
  })));

  return contents;
}

export async function getAiContextBundle(scopes: AiContextScope[]): Promise<string> {
  const sections = await getAiContextSections(scopes);

  return sections
    .map((section) => `## ${section.title}\n\n${section.content.trim()}`)
    .join("\n\n");
}
