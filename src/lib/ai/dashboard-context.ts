import "server-only";

import { getServerBoardById, getServerBoardTicketById } from "@/lib/api/serverClient";
import { prisma } from "@/lib/prisma";
import type { TicketAccessPolicy, TicketPermission } from "@/types";
import type { AiChatRuntimeContext, AiDashboardSection } from "./types";

const STANDARD_MEMBER_ROLES = ["OWNER", "ADMIN", "MEMBER", "VIEWER"] as const;
const TICKET_PERMISSIONS = ["view", "fill", "edit", "delete", "estimate", "comment", "manageAccess"] as const;
const MAX_CUSTOM_ROLE_NAMES = 8;
const MAX_COLUMN_SUMMARIES = 8;
const MAX_DESCRIPTION_LENGTH = 240;
const MAX_VISIBLE_TICKET_CONTEXT = 20;
const MAX_TICKET_TITLE_LENGTH = 120;
const MAX_TICKET_DESCRIPTION_LENGTH = 220;

function truncateText(value: string | null | undefined, maxLength: number): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().replace(/\s+/g, " ");

  if (!normalized) {
    return null;
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 3).trimEnd()}...`;
}

function formatLimitedList(items: string[], maxItems: number): string {
  if (items.length === 0) {
    return "none";
  }

  const visibleItems = items.slice(0, maxItems);
  const remainingCount = items.length - visibleItems.length;

  if (remainingCount <= 0) {
    return visibleItems.join(", ");
  }

  return `${visibleItems.join(", ")}, +${remainingCount} more`;
}

function formatVisibleTicketLine(input: {
  title: string;
  description?: string | null;
  columnId?: string | null;
  columnTitlesById: Map<string, string>;
}): string {
  const title = truncateText(input.title, MAX_TICKET_TITLE_LENGTH) ?? "Untitled ticket";
  const description = truncateText(input.description, MAX_TICKET_DESCRIPTION_LENGTH) ?? "no description";
  const columnTitle = input.columnId ? input.columnTitlesById.get(input.columnId) : null;

  if (columnTitle) {
    return `${title} [${columnTitle}] — ${description}`;
  }

  return `${title} — ${description}`;
}

function normalizeRolePermissions(permissions: unknown): TicketPermission[] {
  if (!Array.isArray(permissions)) {
    return [];
  }

  const validPermissions = new Set<TicketPermission>(TICKET_PERMISSIONS);

  return Array.from(
    new Set(
      permissions
        .filter((permission): permission is string => typeof permission === "string")
        .map((permission) => permission.trim() as TicketPermission)
        .filter((permission) => validPermissions.has(permission)),
    ),
  );
}

function normalizeTicketAccessPolicy(accessPolicy: unknown): TicketAccessPolicy {
  const source = (accessPolicy && typeof accessPolicy === "object" ? accessPolicy : {}) as Record<string, unknown>;

  const getRoles = (key: TicketPermission): string[] => {
    const value = source[key];
    if (!Array.isArray(value)) {
      return [];
    }

    return Array.from(
      new Set(
        value
          .filter((role): role is string => typeof role === "string")
          .map((role) => role.trim())
          .filter(Boolean),
      ),
    );
  };

  return {
    view: getRoles("view"),
    fill: getRoles("fill"),
    edit: getRoles("edit"),
    delete: getRoles("delete"),
    estimate: getRoles("estimate"),
    comment: getRoles("comment"),
    manageAccess: getRoles("manageAccess"),
  };
}

function canManageTicketAccess(role: string | null): boolean {
  return role === "OWNER" || role === "ADMIN";
}

function getEffectiveTicketRoles(input: { role: string | null; customRoleName: string | null }): Set<string> {
  const roles = new Set<string>();

  if (input.role) {
    roles.add(input.role.toLowerCase());
  }

  const customRoleName = input.customRoleName?.trim().toLowerCase();
  if (customRoleName) {
    roles.add(customRoleName);
  }

  return roles;
}

function canUseTicketPermission(input: {
  accessPolicy: unknown;
  role: string | null;
  customRoleName: string | null;
  customRolePermissions: TicketPermission[];
  permission: TicketPermission;
}): boolean {
  if (!input.role) {
    return false;
  }

  if (canManageTicketAccess(input.role)) {
    return true;
  }

  if (input.customRoleName?.trim() && input.customRolePermissions.length > 0) {
    const customRolePermissions = new Set(input.customRolePermissions);
    if (!customRolePermissions.has(input.permission)) {
      return false;
    }
  }

  const normalizedPolicy = normalizeTicketAccessPolicy(input.accessPolicy);
  const allowedRoles = normalizedPolicy[input.permission] ?? [];
  if (!allowedRoles.length) {
    return true;
  }

  const effectiveRoles = getEffectiveTicketRoles({
    role: input.role,
    customRoleName: input.customRoleName,
  });

  return allowedRoles.some((role) => effectiveRoles.has(role.toLowerCase()));
}

function formatAllowedTicketActions(input: {
  accessPolicy: unknown;
  role: string | null;
  customRoleName: string | null;
  customRolePermissions: TicketPermission[];
}): string {
  const allowedPermissions = TICKET_PERMISSIONS.filter((permission) =>
    canUseTicketPermission({
      accessPolicy: input.accessPolicy,
      role: input.role,
      customRoleName: input.customRoleName,
      customRolePermissions: input.customRolePermissions,
      permission,
    }),
  );

  return allowedPermissions.length > 0 ? allowedPermissions.join(", ") : "none";
}

function buildRoleDistribution(
  memberships: Array<{ userId: string; role: string }>,
  ownerId: string | null,
): Record<(typeof STANDARD_MEMBER_ROLES)[number], number> {
  const counts = {
    OWNER: 0,
    ADMIN: 0,
    MEMBER: 0,
    VIEWER: 0,
  };

  for (const membership of memberships) {
    if (membership.role in counts) {
      counts[membership.role as keyof typeof counts] += 1;
    }
  }

  if (ownerId && !memberships.some((membership) => membership.userId === ownerId)) {
    counts.OWNER += 1;
  }

  return counts;
}

function formatRoleDistribution(distribution: Record<(typeof STANDARD_MEMBER_ROLES)[number], number>): string {
  return STANDARD_MEMBER_ROLES.map((role) => `${role} ${distribution[role]}`).join(", ");
}

function buildSectionFocus(section: AiDashboardSection): string {
  if (section === "users") {
    return "board members, roles, custom roles, and invitation usage";
  }

  if (section === "settings") {
    return "board settings, access structure, and invitation configuration";
  }

  return "board structure, columns, ticket flow, and general collaboration setup";
}

function buildInvitationSummary(
  invitations: Array<{ type: string; status: string }> | undefined,
): { pendingPersonal: number; pendingShared: number; acceptedTotal: number } {
  const summary = {
    pendingPersonal: 0,
    pendingShared: 0,
    acceptedTotal: 0,
  };

  for (const invitation of invitations ?? []) {
    if (invitation.status === "accepted") {
      summary.acceptedTotal += 1;
    }

    if (invitation.status !== "pending") {
      continue;
    }

    if (invitation.type === "PERSONAL") {
      summary.pendingPersonal += 1;
      continue;
    }

    if (invitation.type === "SHARED") {
      summary.pendingShared += 1;
    }
  }

  return summary;
}

export async function buildAiVerifiedRuntimeContext(input: {
  userId: string;
  runtimeContext?: AiChatRuntimeContext;
}): Promise<string | null> {
  const boardContext = input.runtimeContext?.board;

  if (!boardContext?.boardId) {
    return null;
  }

  const includeInvitationDetails = boardContext.section === "users" || boardContext.section === "settings";
  const [board, visibleBoard, activeTicket] = await Promise.all([
    prisma.board.findFirst({
      where: {
        id: boardContext.boardId,
        OR: [{ ownerId: input.userId }, { memberships: { some: { userId: input.userId } } }],
      },
      select: {
        id: true,
        title: true,
        description: true,
        ownerId: true,
        allowPersonalInvites: true,
        allowSharedInvites: true,
        defaultSharedInvitationMode: true,
        inviteExpiresHours: true,
        sharedInviteMaxUses: true,
        memberships: {
          select: {
            userId: true,
            role: true,
            customRole: {
              select: {
                name: true,
                permissions: true,
              },
            },
          },
        },
        roles: {
          orderBy: {
            name: "asc",
          },
          select: {
            name: true,
          },
        },
        columns: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            title: true,
            tickets: {
              select: {
                id: true,
              },
            },
          },
        },
        _count: {
          select: {
            memberships: true,
            columns: true,
            tickets: true,
            roles: true,
            invitations: true,
          },
        },
        ...(includeInvitationDetails
          ? {
              invitations: {
                select: {
                  type: true,
                  status: true,
                },
              },
            }
          : {}),
      },
    }),
    boardContext.section === "board"
      ? getServerBoardById(boardContext.boardId, input.userId, { ticketsLimit: MAX_VISIBLE_TICKET_CONTEXT })
      : Promise.resolve(null),
    boardContext.activeTicketId
      ? getServerBoardTicketById(boardContext.boardId, boardContext.activeTicketId, input.userId)
      : Promise.resolve(null),
  ]);

  if (!board) {
    return null;
  }

  const currentMembership = board.memberships.find((membership) => membership.userId === input.userId) ?? null;
  const currentUserRole = board.ownerId === input.userId ? "OWNER" : currentMembership?.role ?? "unknown";
  const currentUserCustomRole = currentMembership?.customRole?.name ?? null;
  const currentUserCustomRolePermissions = normalizeRolePermissions(currentMembership?.customRole?.permissions ?? []);
  const ownerAlreadyCounted = board.ownerId
    ? board.memberships.some((membership) => membership.userId === board.ownerId)
    : false;
  const participantCount = board._count.memberships + (board.ownerId && !ownerAlreadyCounted ? 1 : 0);
  const roleDistribution = buildRoleDistribution(board.memberships, board.ownerId ?? null);
  const customRoleNames = Array.from(
    new Set(
      board.roles
        .map((role) => role.name.trim())
        .filter(Boolean),
    ),
  );
  const columnSummaries = board.columns.map((column) => `${column.title} (${column.tickets.length} tickets)`);
  const columnTitlesById = new Map(board.columns.map((column) => [column.id, column.title]));
  const invitationSummary = buildInvitationSummary("invitations" in board ? board.invitations : undefined);
  const inviteSettings = [
    `personal invites ${board.allowPersonalInvites ? "enabled" : "disabled"}`,
    `shared invites ${board.allowSharedInvites ? "enabled" : "disabled"}`,
    `shared invite mode ${board.defaultSharedInvitationMode}`,
    `invite expiry ${board.inviteExpiresHours} hours`,
    `shared invite max uses ${board.sharedInviteMaxUses}`,
  ].join("; ");
  const description = truncateText(board.description, MAX_DESCRIPTION_LENGTH);

  const lines = [
    "This runtime context is verified on the server for the current user and active dashboard board.",
    `- board id: ${board.id}`,
    `- dashboard section: ${boardContext.section}`,
    `- section focus: ${buildSectionFocus(boardContext.section)}`,
    `- board title: ${board.title}`,
    `- board description: ${description ?? "none"}`,
    `- current user board role: ${currentUserRole}`,
    `- current user custom role: ${currentUserCustomRole ?? "none"}`,
    `- participant count: ${participantCount}`,
    `- standard role distribution: ${formatRoleDistribution(roleDistribution)}`,
    `- custom roles defined: ${formatLimitedList(customRoleNames, MAX_CUSTOM_ROLE_NAMES)}`,
    `- total columns: ${board._count.columns}`,
    `- total tickets: ${board._count.tickets}`,
    `- columns and ticket counts: ${formatLimitedList(columnSummaries, MAX_COLUMN_SUMMARIES)}`,
    `- invitation settings: ${inviteSettings}`,
  ];

  if (boardContext.section === "users" || boardContext.section === "settings") {
    lines.push(`- total invitations: ${board._count.invitations}`);
    lines.push(
      `- pending invitations: PERSONAL ${invitationSummary.pendingPersonal}, SHARED ${invitationSummary.pendingShared}`,
    );
    lines.push(`- accepted invitations total: ${invitationSummary.acceptedTotal}`);
  }

  if (boardContext.section === "board") {
    const visibleTicketLines = (visibleBoard?.tickets ?? []).map((ticket) =>
      formatVisibleTicketLine({
        title: ticket.title,
        description: ticket.description,
        columnId: ticket.columnId,
        columnTitlesById,
      }),
    );

    lines.push(`- visible ticket details included for AI: ${visibleTicketLines.length} tickets`);

    if (visibleTicketLines.length > 0) {
      lines.push(`- visible tickets are limited to the first ${MAX_VISIBLE_TICKET_CONTEXT} accessible tickets in the current board response`);
      lines.push("- visible ticket titles and descriptions:");
      for (const ticketLine of visibleTicketLines) {
        lines.push(`  - ${ticketLine}`);
      }
    }
  }

  if (boardContext.activeTicketId) {
    if (activeTicket) {
      const activeTicketColumnTitle = activeTicket.columnId ? columnTitlesById.get(activeTicket.columnId) : null;
      const activeTicketAllowedActions = formatAllowedTicketActions({
        accessPolicy: activeTicket.accessPolicy,
        role: currentUserRole,
        customRoleName: currentUserCustomRole,
        customRolePermissions: currentUserCustomRolePermissions,
      });

      lines.push("- active ticket context is verified from the currently open ticket modal");
      lines.push(`- active ticket id: ${activeTicket.id}`);
      lines.push(`- active ticket title: ${truncateText(activeTicket.title, MAX_TICKET_TITLE_LENGTH) ?? "Untitled ticket"}`);
      lines.push(`- active ticket description: ${truncateText(activeTicket.description, MAX_TICKET_DESCRIPTION_LENGTH) ?? "no description"}`);
      lines.push(`- active ticket status: ${activeTicket.status}`);
      lines.push(`- active ticket type: ${activeTicket.type}`);
      lines.push(`- active ticket priority: ${activeTicket.priority}`);
      lines.push(`- active ticket column: ${activeTicketColumnTitle ?? "none"}`);
      lines.push(`- active ticket allowed actions for current user: ${activeTicketAllowedActions}`);
    } else {
      lines.push("- requested active ticket context could not be verified and must be ignored");
    }
  }

  lines.push(
    "- intentionally omitted from runtime context: member emails, invite tokens, inaccessible tickets, ticket comments, and other private user data.",
  );

  return lines.join("\n");
}