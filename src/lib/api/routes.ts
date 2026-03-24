const DEFAULT_API_BASE_URL = "http://localhost:8082";

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  return trimTrailingSlash(envUrl ?? DEFAULT_API_BASE_URL);
}

// All browser-facing board routes go through the Next.js proxy which
// attaches the verified session userId and the internal secret before
// forwarding to Nest. This prevents IDOR via user-supplied query params.
const PROXY_BASE = "/api/proxy";

export const apiRoutes = {
  health: () => `${getApiBaseUrl()}/health`,
  boards: () => `${PROXY_BASE}/boards`,
  boardById: (boardId: string) => `${PROXY_BASE}/boards/${boardId}`,
  notifications: () => `${PROXY_BASE}/notifications`,
  notificationReadAll: () => `${PROXY_BASE}/notifications/read-all`,
  notificationByIdRead: (notificationId: string) => `${PROXY_BASE}/notifications/${notificationId}/read`,
  userDefaultState: () => `${PROXY_BASE}/users/me/default-state`,
  userDefaultProfile: () => `${PROXY_BASE}/users/me/default-profile`,
  boardTickets: (boardId: string) => `${PROXY_BASE}/boards/${boardId}/tickets`,
  boardTicketById: (boardId: string, ticketId: string) =>
    `${PROXY_BASE}/boards/${boardId}/tickets/${ticketId}`,
  boardTicketComments: (boardId: string, ticketId: string) =>
    `${PROXY_BASE}/boards/${boardId}/tickets/${ticketId}/comments`,
  boardTicketsReorder: (boardId: string) =>
    `${PROXY_BASE}/boards/${boardId}/tickets/reorder`,
  boardColumns: (boardId: string) => `${PROXY_BASE}/boards/${boardId}/columns`,
  boardColumnsOrder: (boardId: string) =>
    `${PROXY_BASE}/boards/${boardId}/columns/order`,
  boardColumnById: (boardId: string, columnId: string) =>
    `${PROXY_BASE}/boards/${boardId}/columns/${columnId}`,
  boardMembers: (boardId: string) => `${PROXY_BASE}/boards/${boardId}/members`,
  boardMembersMe: (boardId: string) => `${PROXY_BASE}/boards/${boardId}/members/me`,
  boardMemberById: (boardId: string, memberId: string) =>
    `${PROXY_BASE}/boards/${boardId}/members/${memberId}`,
  boardMemberCustomRole: (boardId: string, memberId: string) =>
    `${PROXY_BASE}/boards/${boardId}/members/${memberId}/custom-role`,
  boardRoles: (boardId: string) => `${PROXY_BASE}/boards/${boardId}/roles`,
  boardRoleById: (boardId: string, roleId: string) =>
    `${PROXY_BASE}/boards/${boardId}/roles/${roleId}`,
  boardInvitations: (boardId: string) =>
    `${PROXY_BASE}/boards/${boardId}/invitations`,
  boardInvitationById: (boardId: string, invitationId: string) =>
    `${PROXY_BASE}/boards/${boardId}/invitations/${invitationId}`,
  invitationByToken: (token: string) =>
    `${PROXY_BASE}/invitations/${token}`,
  acceptInvitationByToken: (token: string) =>
    `${PROXY_BASE}/invitations/${token}/accept`,
};
