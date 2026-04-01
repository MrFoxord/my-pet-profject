import { Board, BoardDto, Ticket, TicketAccessPolicy, TicketComment, TicketEstimate } from "@/types";
import { apiRoutes } from "@/lib/api/routes";
import type { TicketPriority, TicketStatus, TicketType } from "@/shared/tickets";

export type BoardRole = {
  id: string;
  boardId: string;
  name: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
};

export type RealtimeNotification = {
  id: string;
  kind: "board" | "ticket";
  boardId: string;
  ticketId?: string;
  title: string;
  message: string;
  isRead: boolean;
  unreadCount?: number;
  createdAt: string;
};

export type BoardMember = {
  id: string;
  boardId: string;
  userId: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  customRoleId: string | null;
  customRoleName: string | null;
  customRolePermissions?: string[];
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

export type InvitationType = "PERSONAL" | "SHARED";

export type InvitationState =
  | "pending"
  | "expired"
  | "revoked"
  | "limit_reached"
  | "accepted";

export type SharedInvitationMode = "SINGLE_USE" | "MULTI_USE";

export type BoardInvitation = {
  id: string;
  boardId: string;
  type: InvitationType;
  email: string | null;
  customRoleId: string | null;
  customRoleName: string | null;
  createdByUserId: string | null;
  status: "pending" | "accepted" | "declined";
  state: InvitationState;
  maxUses: number;
  usedCount: number;
  token: string;
  shareUrl: string;
  expiresAt: string;
  createdAt: string;
};

export type BoardInvitationPublic = {
  id: string;
  token: string;
  type: InvitationType;
  email: string | null;
  boardId: string;
  customRoleId: string | null;
  customRoleName: string | null;
  createdByUserId: string | null;
  status: "pending" | "accepted" | "declined";
  state: InvitationState;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  createdAt: string;
  board: {
    id: string;
    title: string;
    logoUrl: string | null;
  };
};

export type CreateBoardInvitationInput = {
  type: InvitationType;
  email?: string;
  customRoleId?: string | null;
  sharedInvitationMode?: SharedInvitationMode;
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

export type UpdateBoardInput = {
  title?: string;
  description?: string | null;
  themeColor?: string | null;
  logoUrl?: string | null;
  allowPersonalInvites?: boolean;
  allowSharedInvites?: boolean;
  defaultSharedInvitationMode?: SharedInvitationMode;
  inviteExpiresHours?: number;
  sharedInviteMaxUses?: number;
};

export type ApiTicketReorderItem = {
  id: string;
  status: TicketStatus;
  sortIndex: number;
  columnId?: string;
};

export type CreateTicketInput = {
  title: string;
  boardId: string;
  status: TicketStatus;
  type: TicketType;
  description?: string;
  priority?: TicketPriority;
  columnId?: string;
  accessPolicy?: TicketAccessPolicy;
  estimate?: TicketEstimate;
};

export type UpdateTicketInput = {
  title?: string;
  description?: string;
  status?: TicketStatus;
  type?: TicketType;
  priority?: TicketPriority;
  columnId?: string;
  sortIndex?: number;
  accessPolicy?: TicketAccessPolicy;
  estimate?: TicketEstimate;
};

export type ApiTicketReorderPayload = {
  items: ApiTicketReorderItem[];
};

export type ApiBoardColumn = {
  id: string;
  title: string;
  position: number;
};

export type NotificationsResponse = {
  unreadCount: number;
  items: RealtimeNotification[];
};

export type ApiBoardResponse = Omit<Board, "columns"> & {
  columns?: ApiBoardColumn[];
  currentUserRole?: string | null;
  currentUserCustomRoleName?: string | null;
};

export type GetBoardByIdOptions = {
  ticketsOffset?: number;
  ticketsLimit?: number;
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
      const body = (await response.json()) as { message?: string | string[]; error?: string };
      if (Array.isArray(body?.message) && body.message.length > 0) {
        message += ` — ${body.message.join(", ")}`;
      } else if (typeof body?.message === "string") {
        message += ` — ${body.message}`;
      } else if (body?.error) {
        message += ` — ${body.error}`;
      }
    } catch {
      // non-JSON error body, keep generic message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text.trim()) {
    return null;
  }

  return JSON.parse(text) as T;
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
      estimateOriginalHours: input.estimate?.originalHours ?? null,
      estimateSpentHours: input.estimate?.spentHours ?? null,
      estimateRemainingHours: input.estimate?.remainingHours ?? null,
      storyPoints: input.estimate?.storyPoints ?? null,
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
  const body = input.estimate
    ? {
        ...input,
        estimateOriginalHours: input.estimate.originalHours ?? null,
        estimateSpentHours: input.estimate.spentHours ?? null,
        estimateRemainingHours: input.estimate.remainingHours ?? null,
        storyPoints: input.estimate.storyPoints ?? null,
      }
    : input;

  return apiRequest<Ticket>(apiRoutes.boardTicketById(boardId, ticketId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function getBoardTicketById(
  boardId: string,
  ticketId: string
): Promise<Ticket | null> {
  return apiRequest<Ticket>(apiRoutes.boardTicketById(boardId, ticketId), {
    cache: "no-store",
  });
}

export async function createTicketComment(
  boardId: string,
  ticketId: string,
  body: string
): Promise<TicketComment | null> {
  return apiRequest<TicketComment>(apiRoutes.boardTicketComments(boardId, ticketId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ body }),
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

export async function getBoardById(
  boardId: string,
  options?: GetBoardByIdOptions,
): Promise<ApiBoardResponse | null> {
  const query = new URLSearchParams();
  if (options?.ticketsOffset !== undefined) {
    query.set("ticketsOffset", String(options.ticketsOffset));
  }
  if (options?.ticketsLimit !== undefined) {
    query.set("ticketsLimit", String(options.ticketsLimit));
  }

  const route = query.size > 0
    ? `${apiRoutes.boardById(boardId)}?${query.toString()}`
    : apiRoutes.boardById(boardId);

  return apiRequest<ApiBoardResponse>(
    route,
    { cache: "no-store" },
    { allowNotFound: true }
  );
}

export async function deleteBoard(boardId: string): Promise<void> {
  await apiRequest(apiRoutes.boardById(boardId), {
    method: "DELETE",
  });
}

export async function updateBoard(
  boardId: string,
  input: UpdateBoardInput
): Promise<ApiBoardResponse | null> {
  return apiRequest<ApiBoardResponse>(apiRoutes.boardById(boardId), {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function getNotifications(): Promise<NotificationsResponse> {
  const data = await apiRequest<NotificationsResponse>(apiRoutes.notifications(), { cache: "no-store" });
  return data ?? { unreadCount: 0, items: [] };
}

export async function markNotificationRead(notificationId: string): Promise<{ ok: boolean; unreadCount: number } | null> {
  return apiRequest<{ ok: boolean; unreadCount: number }>(apiRoutes.notificationByIdRead(notificationId), {
    method: "PATCH",
  });
}

export async function markAllNotificationsRead(): Promise<{ ok: boolean; unreadCount: number } | null> {
  return apiRequest<{ ok: boolean; unreadCount: number }>(apiRoutes.notificationReadAll(), {
    method: "PATCH",
  });
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

export async function deleteBoardMember(
  boardId: string,
  memberId: string
): Promise<void> {
  await apiRequest(apiRoutes.boardMemberById(boardId, memberId), {
    method: "DELETE",
  });
}

export async function leaveBoard(boardId: string): Promise<void> {
  await apiRequest(apiRoutes.boardMembersMe(boardId), {
    method: "DELETE",
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

export async function createBoardColumn(
  boardId: string,
  title: string
): Promise<ApiBoardColumn | null> {
  return apiRequest<ApiBoardColumn>(apiRoutes.boardColumns(boardId), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
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

export async function deleteBoardInvitation(
  boardId: string,
  invitationId: string
): Promise<void> {
  await apiRequest(apiRoutes.boardInvitationById(boardId, invitationId), {
    method: "DELETE",
  });
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
  token: string
): Promise<{ success: boolean; boardId: string; alreadyMember?: boolean } | null> {
  return apiRequest<{ success: boolean; boardId: string }>(
    apiRoutes.acceptInvitationByToken(token),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    }
  );
}
