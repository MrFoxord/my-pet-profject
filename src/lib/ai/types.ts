import { z } from "zod";

export const AI_ASSISTANT_MODES = ["product"] as const;
export const AI_CONTEXT_SCOPES = ["product", "guidance", "limitations"] as const;
export const AI_MESSAGE_ROLES = ["user", "assistant"] as const;
export const AI_DASHBOARD_SECTIONS = ["board", "users", "settings"] as const;

export type AiAssistantMode = (typeof AI_ASSISTANT_MODES)[number];
export type AiContextScope = (typeof AI_CONTEXT_SCOPES)[number];
export type AiMessageRole = (typeof AI_MESSAGE_ROLES)[number];
export type AiDashboardSection = (typeof AI_DASHBOARD_SECTIONS)[number];

export const aiChatMessageSchema = z.object({
  role: z.enum(AI_MESSAGE_ROLES),
  content: z.string().trim().min(1).max(4000),
});

export const aiChatRuntimeBoardContextSchema = z.object({
  boardId: z.string().trim().min(1).max(191),
  section: z.enum(AI_DASHBOARD_SECTIONS).default("board"),
  activeTicketId: z.string().trim().min(1).max(191).optional(),
});

export const aiChatRuntimeContextSchema = z.object({
  board: aiChatRuntimeBoardContextSchema.optional(),
});

export const aiChatRequestSchema = z.object({
  messages: z.array(aiChatMessageSchema).min(1).max(10),
  locale: z.string().trim().min(2).max(16).default("en"),
  assistantMode: z.enum(AI_ASSISTANT_MODES).default("product"),
  contextScope: z.array(z.enum(AI_CONTEXT_SCOPES)).min(1).max(AI_CONTEXT_SCOPES.length).default([...AI_CONTEXT_SCOPES]),
  runtimeContext: aiChatRuntimeContextSchema.optional(),
});

export type AiChatMessage = z.infer<typeof aiChatMessageSchema>;
export type AiChatRuntimeContext = z.infer<typeof aiChatRuntimeContextSchema>;
export type AiChatRequest = z.infer<typeof aiChatRequestSchema>;

export type AiChatResponse = {
  message: {
    role: "assistant";
    content: string;
  };
  meta: {
    provider: string;
    model: string;
    finishReason: "stop" | "length" | "error";
    assistantMode: AiAssistantMode;
    contextScope: AiContextScope[];
    isMock: boolean;
  };
};
