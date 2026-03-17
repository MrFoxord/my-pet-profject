import { Board, BoardDto, Ticket } from "@/types";
import { apiRoutes } from "@/lib/api/routes";

export type BoardRole = {
  id: string;
  boardId: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateBoardRoleInput = {
  name: string;
  permissions?: string[];
};

export type UpdateBoardRoleInput = {
  name?: string;
  permissions?: string[];
};

export type CreateBoardInput = {
  title: string;
  description: string | null;
  themeColor: string;
  logoUrl: string | null;
  columns: string[];
  customRoles?: string[];
  ownerId?: string;
  dashboardRole?: string;
};

export type ApiTicketReorderItem = {
  id: string;
  status: "todo" | "in-progress" | "done";
  sortIndex: number;
  columnId?: string;
};

export type CreateTicketInput = {
  title: string;
  boardId: string;
  status: "todo" | "in-progress" | "done";
  type: "bug" | "feature" | "task";
  description?: string;
  priority?: "low" | "medium" | "high" | "critical";
  columnId?: string;
  accessibilityRoles?: string[];
  accessibilityIds?: string[];
};

export type UpdateTicketInput = {
  title?: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  type?: "bug" | "feature" | "task";
  priority?: "low" | "medium" | "high" | "critical";
  columnId?: string;
  sortIndex?: number;
  accessibilityRoles?: string[];
  accessibilityIds?: string[];
};

export type ApiTicketReorderPayload = {
  items: ApiTicketReorderItem[];
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

export async function createTicket(input: CreateTicketInput): Promise<Ticket | null> {
  return apiRequest<Ticket>(apiRoutes.boardTickets(input.boardId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: input.title,
      description: input.description,
      status: input.status,
      type: input.type,
      priority: input.priority,
      columnId: input.columnId,
      accessibilityRoles: input.accessibilityRoles,
      accessibilityIds: input.accessibilityIds,
    }),
  });
}

export async function reorderBoardTickets(
  boardId: string,
  payload: ApiTicketReorderPayload
): Promise<void> {
  await apiRequest(apiRoutes.boardTicketsReorder(boardId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function updateTicket(
  boardId: string,
  ticketId: string,
  input: UpdateTicketInput
): Promise<Ticket | null> {
  return apiRequest<Ticket>(apiRoutes.boardTicketById(boardId, ticketId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function deleteTicket(boardId: string, ticketId: string): Promise<void> {
  await apiRequest(apiRoutes.boardTicketById(boardId, ticketId), {
    method: "DELETE",
  });
}
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

export async function getBoardRoles(boardId: string): Promise<BoardRole[]> {
  const data = await apiRequest<BoardRole[]>(apiRoutes.boardRoles(boardId));
  return data ?? [];
}

export async function createBoardRole(
  boardId: string,
  input: CreateBoardRoleInput
): Promise<BoardRole | null> {
  return apiRequest<BoardRole>(apiRoutes.boardRoles(boardId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function updateBoardRole(
  boardId: string,
  roleId: string,
  input: UpdateBoardRoleInput
): Promise<BoardRole | null> {
  return apiRequest<BoardRole>(apiRoutes.boardRoleById(boardId, roleId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function deleteBoardRole(boardId: string, roleId: string): Promise<void> {
  await apiRequest(apiRoutes.boardRoleById(boardId, roleId), {
    method: "DELETE",
  });
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
