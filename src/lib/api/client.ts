import { Board, BoardDto, Ticket, TicketAccessPolicy } from "@/types";
import { apiRoutes } from "@/lib/api/routes";

export type BoardRole = {
  id: string;
  boardId: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

export type BoardMember = {
  id: string;
  boardId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  customRoleId: string | null;
  customRoleName: string | null;
  email: string | null;
  name: string | null;
  nickname: string | null;
};

export type CreateBoardRoleInput = {
  name: string;
  permissions?: string[];
};

export type UpdateBoardRoleInput = {
  name?: string;
  permissions?: string[];
};

export type BoardInvitation = {
  id: string;
  boardId: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  status: "pending" | "accepted" | "declined";
  token: string;
  shareUrl: string;
  expiresAt: string;
  createdAt: string;
};

export type BoardInvitationPublic = {
  id: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  status: "pending" | "accepted" | "declined";
  expiresAt: string;
  board: {
    id: string;
    title: string;
    logoUrl: string | null;
  };
};

export type CreateBoardInvitationInput = {
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
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
  accessPolicy?: TicketAccessPolicy;
};

export type UpdateTicketInput = {
  title?: string;
  description?: string;
  status?: "todo" | "in-progress" | "done";
  type?: "bug" | "feature" | "task";
  priority?: "low" | "medium" | "high" | "critical";
  columnId?: string;
  sortIndex?: number;
  accessPolicy?: TicketAccessPolicy;
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
    let message = `API request failed: ${response.status}`;
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      if (body?.message) message += ` — ${body.message}`;
    } catch {
      // non-JSON error body, keep generic message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return (await response.json()) as T;
}

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
      accessPolicy: input.accessPolicy,
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

export async function getBoardById(boardId: string): Promise<ApiBoardResponse | null> {
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

export async function getBoardMembers(boardId: string): Promise<BoardMember[]> {
  const data = await apiRequest<BoardMember[]>(apiRoutes.boardMembers(boardId));
  return data ?? [];
}

export async function updateBoardMemberCustomRole(
  boardId: string,
  memberId: string,
  customRoleId: string | null
): Promise<BoardMember | null> {
  return apiRequest<BoardMember>(apiRoutes.boardMemberCustomRole(boardId, memberId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customRoleId }),
  });
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

export async function createBoardInvitation(
  boardId: string,
  input: CreateBoardInvitationInput
): Promise<BoardInvitation | null> {
  return apiRequest<BoardInvitation>(apiRoutes.boardInvitations(boardId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function getBoardInvitations(boardId: string): Promise<BoardInvitation[]> {
  const data = await apiRequest<BoardInvitation[]>(apiRoutes.boardInvitations(boardId));
  return data ?? [];
}

export async function getInvitationByToken(
  token: string
): Promise<BoardInvitationPublic | null> {
  return apiRequest<BoardInvitationPublic>(
    apiRoutes.invitationByToken(token),
    { cache: "no-store" },
    { allowNotFound: true }
  );
}

export async function acceptInvitationByToken(
  token: string,
  userId?: string
): Promise<{ success: boolean; boardId: string } | null> {
  return apiRequest<{ success: boolean; boardId: string }>(
    apiRoutes.acceptInvitationByToken(token),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    }
  );
}
