import { Board } from "@/types";
import { buildColumnsFromApi } from "@/lib/boards";
import { getServerBoardById } from "@/lib/api/serverClient";

export async function getDashboardBoard(
  boardId: string,
  userId?: string | null
): Promise<Board | null> {
  const board = await getServerBoardById(boardId, userId);

  if (!board) {
    return null;
  }

  const tickets = board.tickets ?? [];
  const apiColumns = board.columns ?? [];

  return {
    ...board,
    tickets,
    columns: buildColumnsFromApi(apiColumns, tickets),
  };
}