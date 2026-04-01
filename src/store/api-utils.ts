import { ApiBoardResponse } from "@/lib/api/client";
import { Board } from "@/types";
import { buildColumnsFromApi } from "@/lib/boards";

type CustomQueryError = {
  status: "CUSTOM_ERROR";
  error: string;
};

export function toCustomError(error: unknown, fallback: string): CustomQueryError {
  return {
    status: "CUSTOM_ERROR",
    error: error instanceof Error ? error.message : fallback,
  };
}

export function toBoard(apiBoard: ApiBoardResponse): Board {
  const tickets = apiBoard.tickets ?? [];

  return {
    ...apiBoard,
    tickets,
    columns: buildColumnsFromApi(apiBoard.columns ?? [], tickets),
  };
}