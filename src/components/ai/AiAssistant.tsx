"use client";

import { sendAiChatRequest } from "@/lib/ai/client";
import type { AiChatMessage, AiChatResponse, AiChatRuntimeContext } from "@/lib/ai/types";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectBoardUiState } from "@/store/slices/dashboardUiSlice";
import { AiAssistantLauncher } from "./AiAssistantLauncher";
import { AiAssistantPanel } from "./AiAssistantPanel";
import { resolveAiAssistantCopy } from "./copy";

function isProductAssistantRoute(pathname: string): boolean {
  return pathname === "/boards" || pathname.startsWith("/dashboard");
}

function resolveAiBaseRuntimeContext(pathname: string): AiChatRuntimeContext | undefined {
  const dashboardMatch = pathname.match(/^\/dashboard\/([^/]+)(?:\/(users|settings))?$/);

  if (!dashboardMatch) {
    return undefined;
  }

  const [, rawBoardId, rawSection] = dashboardMatch;
  const boardId = rawBoardId ? decodeURIComponent(rawBoardId) : "";

  if (!boardId) {
    return undefined;
  }

  return {
    board: {
      boardId,
      section: rawSection === "users" || rawSection === "settings" ? rawSection : "board",
    },
  };
}

export function AiAssistant() {
  const pathname = usePathname();
  const locale = useLocale();
  const { status } = useSession();
  const copy = useMemo(() => resolveAiAssistantCopy(locale), [locale]);
  const baseRuntimeContext = useMemo(() => resolveAiBaseRuntimeContext(pathname), [pathname]);
  const activeBoardId = baseRuntimeContext?.board?.boardId ?? null;
  const boardUi = useAppSelector((state) =>
    activeBoardId ? selectBoardUiState(state, activeBoardId) : { selectedTicketId: null, isTicketModalOpen: false },
  );
  const runtimeContext = useMemo<AiChatRuntimeContext | undefined>(() => {
    if (!baseRuntimeContext?.board) {
      return undefined;
    }

    return {
      board: {
        ...baseRuntimeContext.board,
        activeTicketId: boardUi.isTicketModalOpen ? boardUi.selectedTicketId ?? undefined : undefined,
      },
    };
  }, [baseRuntimeContext, boardUi.isTicketModalOpen, boardUi.selectedTicketId]);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMeta, setLastMeta] = useState<AiChatResponse["meta"] | null>(null);

  const canShowAssistant = status === "authenticated" && isProductAssistantRoute(pathname);

  useEffect(() => {
    if (!canShowAssistant) {
      setOpen(false);
    }
  }, [canShowAssistant]);

  const handleSend = async (contentOverride?: string) => {
    const nextMessageContent = (contentOverride ?? value).trim();

    if (!nextMessageContent || isLoading) {
      return;
    }

    const nextUserMessage: AiChatMessage = {
      role: "user",
      content: nextMessageContent,
    };
    const nextMessages = [...messages, nextUserMessage].slice(-10);

    setMessages(nextMessages);
    setValue("");
    setError(null);
    setOpen(true);
    setIsLoading(true);

    try {
      const response = await sendAiChatRequest({
        messages: nextMessages,
        locale,
        runtimeContext,
      });

      setMessages((currentMessages) => [...currentMessages, response.message].slice(-10));
      setLastMeta(response.meta);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : copy.errorFallback;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!canShowAssistant) {
    return null;
  }

  return (
    <>
      <AiAssistantPanel
        open={open}
        copy={copy}
        messages={messages}
        value={value}
        isLoading={isLoading}
        error={error}
        lastMeta={lastMeta}
        onClose={() => setOpen(false)}
        onClear={() => {
          setMessages([]);
          setError(null);
          setLastMeta(null);
        }}
        onValueChange={setValue}
        onSend={() => void handleSend()}
        onSuggestionClick={(suggestion) => {
          void handleSend(suggestion);
        }}
      />

      <AiAssistantLauncher
        open={open}
        label={copy.launcherLabel}
        onClick={() => setOpen((currentValue) => !currentValue)}
      />
    </>
  );
}
