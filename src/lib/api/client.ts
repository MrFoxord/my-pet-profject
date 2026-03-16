import { Board, BoardDto } from "@/types";
import { apiRoutes } from "@/lib/api/routes";

export type CreateBoardInput = {
  title: string;
  description: string | null;
  themeColor: string;
  logoUrl: string | null;
  columns: string[];
  ownerId?: string;
  dashboardRole?: string;
};

export type ApiBoardColumn = {
  id: string;
  title: string;
  position: number;
};

export type ApiBoardResponse = Omit<Board, "columns"> & {
  columns?: ApiBoardColumn[];
  currentUserRole?: string | null;
};

export type UserDefaultStateResponse = {
  id: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  workRole: "CLIENT" | "EXECUTOR" | "ORGANIZER" | "CEO";
  isDefault: boolean;
};

export type UpdateDefaultProfileInput = {
  firstName: string;
  lastName: string;
  nickname?: string;
  workRole: "CLIENT" | "EXECUTOR" | "ORGANIZER" | "CEO";
};

async function apiRequest<T>(
  input: string,
  init?: RequestInit,
  options?: { allowNotFound?: boolean }
): Promise<T | null> {
  const response = await fetch(input, init);

  if (options?.allowNotFound && response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return (await response.json()) as T;
}

export async function getBoards(): Promise<BoardDto[]> {
  const data = await apiRequest<BoardDto[]>(apiRoutes.boards());
  return data ?? [];
}

export async function createBoard(input: CreateBoardInput): Promise<BoardDto | null> {
  return apiRequest<BoardDto>(apiRoutes.boards(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function getBoardById(
  boardId: string
): Promise<ApiBoardResponse | null> {
  return apiRequest<ApiBoardResponse>(
    apiRoutes.boardById(boardId),
    { cache: "no-store" },
    { allowNotFound: true }
  );
}

export async function getUserDefaultState(): Promise<UserDefaultStateResponse> {
  const data = await apiRequest<UserDefaultStateResponse>(apiRoutes.userDefaultState());
  if (!data) {
    throw new Error("API request failed: empty user state response");
  }
  return data;
}

export async function updateDefaultProfile(
  input: UpdateDefaultProfileInput
): Promise<UserDefaultStateResponse> {
  const data = await apiRequest<UserDefaultStateResponse>(apiRoutes.userDefaultProfile(), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!data) {
    throw new Error("API request failed: empty update profile response");
  }

  return data;
}

export async function reorderBoardColumns(
  boardId: string,
  columnIds: string[]
): Promise<void> {
  await apiRequest(apiRoutes.boardColumnsOrder(boardId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ columnIds }),
  });
}

export async function renameBoardColumn(
  boardId: string,
  columnId: string,
  title: string
): Promise<void> {
  await apiRequest(apiRoutes.boardColumnById(boardId, columnId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
}

export async function deleteBoardColumn(
  boardId: string,
  columnId: string,
  ticketIds: string[]
): Promise<void> {
  await apiRequest(apiRoutes.boardColumnById(boardId, columnId), {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ticketIds }),
  });
}
