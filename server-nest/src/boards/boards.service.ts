import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { BoardMemberRole, InvitationType } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { CreateBoardInvitationDto, SharedInvitationMode } from './dto/create-board-invitation.dto';
import { UpdateBoardMemberCustomRoleDto } from './dto/update-board-member-custom-role.dto';
import { CreateBoardRoleDto } from './dto/create-board-role.dto';
import { UpdateBoardRoleDto } from './dto/update-board-role.dto';
import { RealtimeGateway } from '../realtime/realtime.gateway';

const DEFAULT_THEME_COLOR = '#f3f4f6';
const DEFAULT_ASSIGNEE = {
  name: 'Unassigned',
  avatar: 'https://i.pravatar.cc/100?img=1',
};

type BoardMembershipContext = {
  role: BoardMemberRole;
  customRoleName: string | null;
};

type TicketAccessPolicy = {
  view: string[];
  fill: string[];
  edit: string[];
  delete: string[];
  estimate: string[];
  comment: string[];
  manageAccess: string[];
};

type TicketPermission = 'view' | 'fill' | 'edit' | 'delete' | 'estimate' | 'comment' | 'manageAccess';

type InvitationState = 'pending' | 'expired' | 'revoked' | 'limit_reached' | 'accepted';

type InvitationRecord = {
  id: string;
  token: string;
  type: InvitationType;
  email: string | null;
  boardId: string;
  customRoleId: string | null;
  customRoleName: string | null;
  createdByUserId: string | null;
  status: string;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  createdAt: Date;
};

type TicketCommentRecord = {
  id: string;
  body: string;
  createdAt: Date;
  author: {
    name: string | null;
    nickname: string | null;
    email: string | null;
    image: string | null;
  } | null;
};

type TicketRecord = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  sortIndex: number;
  priority: string;
  type: string;
  columnId: string | null;
  accessPolicy: unknown;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date | null;
  estimateOriginalHours: number | null;
  estimateSpentHours: number | null;
  estimateRemainingHours: number | null;
  storyPoints: number | null;
  subtasks: { id: string; title: string; done: boolean }[];
  comments: TicketCommentRecord[];
};

type NotificationRecord = {
  id: string;
  kind: string;
  boardId: string;
  ticketId: string | null;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

type EstimateFieldChange = {
  label: string;
  previous: number | null;
  next: number | null;
};

type FindBoardOptions = {
  ticketsOffset?: number;
  ticketsLimit?: number;
};

@Injectable()
export class BoardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
  ) {}

  private readonly standardTicketAccessRoles = new Set(['owner', 'admin', 'member', 'viewer']);

  private formatEstimateValue(value: number | null) {
    return value === null ? 'none' : String(value);
  }

  private buildEstimateChangeComment(changes: EstimateFieldChange[]) {
    const parts = changes.map(
      (change) => `${change.label}: ${this.formatEstimateValue(change.previous)} -> ${this.formatEstimateValue(change.next)}`,
    );

    return `Estimate updated: ${parts.join('; ')}`;
  }

  private mapNotification(notification: NotificationRecord) {
    const kind: 'board' | 'ticket' = notification.kind === 'ticket' ? 'ticket' : 'board';

    return {
      id: notification.id,
      kind,
      boardId: notification.boardId,
      ticketId: notification.ticketId ?? undefined,
      title: notification.title,
      message: notification.message,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    };
  }

  private async createAndDispatchNotifications(
    userIds: string[],
    input: {
      kind: 'board' | 'ticket';
      boardId: string;
      ticketId?: string;
      title: string;
      message: string;
    },
  ) {
    const uniqueUserIds = Array.from(new Set(userIds.map((id) => id.trim()).filter(Boolean)));
    if (!uniqueUserIds.length) {
      return;
    }

    for (const userId of uniqueUserIds) {
      try {
        const created = await this.prisma.notification.create({
          data: {
            userId,
            kind: input.kind,
            boardId: input.boardId,
            ticketId: input.ticketId ?? null,
            title: input.title,
            message: input.message,
          },
          select: {
            id: true,
            kind: true,
            boardId: true,
            ticketId: true,
            title: true,
            message: true,
            isRead: true,
            createdAt: true,
          },
        });

        const unreadCount = await this.prisma.notification.count({
          where: { userId, isRead: false },
        });

        this.realtimeGateway.emitNotificationToUsers(
          [userId],
          {
            ...this.mapNotification(created),
            unreadCount,
          },
        );
      } catch (error) {
        console.error('failed to persist/dispatch notification', {
          userId,
          boardId: input.boardId,
          ticketId: input.ticketId,
          kind: input.kind,
          error,
        });
      }
    }
  }

  private async getBoardMemberContexts(boardId: string) {
    return this.prisma.boardMember.findMany({
      where: { boardId },
      select: {
        userId: true,
        role: true,
        customRole: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  private emitBoardStateChanged(
    boardId: string,
    reason: 'columns_changed' | 'tickets_changed' | 'members_changed' | 'roles_changed' | 'invitations_changed',
    actorUserId?: string,
  ) {
    this.realtimeGateway.emitBoardStateChanged({
      boardId,
      reason,
      actorUserId,
    });
  }

  private emitTicketStateChanged(
    boardId: string,
    ticketId: string,
    action: 'created' | 'updated' | 'deleted' | 'reordered',
    source: 'ticket' | 'comment',
    actorUserId?: string,
  ) {
    this.realtimeGateway.emitTicketStateChanged({
      boardId,
      ticketId,
      action,
      source,
      actorUserId,
    });
  }

  private async notifyBoardMembers(
    boardId: string,
    input: {
      actorUserId?: string;
      title: string;
      message: string;
    },
  ) {
    const members = await this.getBoardMemberContexts(boardId);
    const recipientIds = members
      .map((member) => member.userId)
      .filter((id) => id && id !== input.actorUserId);

    if (!recipientIds.length) {
      return;
    }

    await this.createAndDispatchNotifications(recipientIds, {
      kind: 'board',
      boardId,
      title: input.title,
      message: input.message,
    });
  }

  private async notifyTicketViewers(
    boardId: string,
    ticketId: string,
    accessPolicy: unknown,
    input: {
      actorUserId?: string;
      title: string;
      message: string;
    },
  ) {
    const members = await this.getBoardMemberContexts(boardId);
    const recipientIds = members
      .filter((member) => member.userId !== input.actorUserId)
      .filter((member) =>
        this.canAccessTicket(accessPolicy, {
          role: member.role,
          customRoleName: member.customRole?.name ?? null,
        }),
      )
      .map((member) => member.userId);

    if (!recipientIds.length) {
      return;
    }

    await this.createAndDispatchNotifications(recipientIds, {
      kind: 'ticket',
      boardId,
      ticketId,
      title: input.title,
      message: input.message,
    });
  }

  async listUserNotifications(userId?: string) {
    if (!userId) {
      throw new BadRequestException('user is required');
    }

    const notifications = await this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        kind: true,
        boardId: true,
        ticketId: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    });

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return {
      unreadCount,
      items: notifications.map((item) => this.mapNotification(item)),
    };
  }

  async markNotificationRead(notificationId: string, userId?: string) {
    if (!userId) {
      throw new BadRequestException('user is required');
    }

    const existing = await this.prisma.notification.findFirst({
      where: { id: notificationId, userId },
      select: {
        id: true,
        kind: true,
        boardId: true,
        ticketId: true,
        title: true,
        message: true,
        isRead: true,
        createdAt: true,
      },
    });

    if (!existing) {
      throw new BadRequestException('notification not found');
    }

    if (!existing.isRead) {
      await this.prisma.notification.update({
        where: { id: existing.id },
        data: { isRead: true, readAt: new Date() },
      });
    }

    const unreadCount = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });

    return { ok: true, unreadCount };
  }

  async markAllNotificationsRead(userId?: string) {
    if (!userId) {
      throw new BadRequestException('user is required');
    }

    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });

    return { ok: true, unreadCount: 0 };
  }

  private mapTicketComment(comment: TicketCommentRecord) {
    return {
      id: comment.id,
      message: comment.body,
      createdAt: comment.createdAt.toISOString(),
      author: {
        name:
          comment.author?.name?.trim() ||
          comment.author?.nickname?.trim() ||
          comment.author?.email?.trim() ||
          'Unknown user',
        avatar: comment.author?.image?.trim() || DEFAULT_ASSIGNEE.avatar,
      },
    };
  }

  private mapTicket(ticket: TicketRecord) {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description ?? '',
      type: ticket.type,
      priority: ticket.priority,
      status: ticket.status,
      sortIndex: ticket.sortIndex,
      columnId: ticket.columnId,
      accessPolicy: this.normalizeTicketAccessPolicy(ticket.accessPolicy),
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      dueDate: ticket.dueDate?.toISOString() ?? '',
      assignee: DEFAULT_ASSIGNEE,
      subtasks: ticket.subtasks,
      comments: ticket.comments.map((comment) => this.mapTicketComment(comment)),
      estimate: {
        originalHours: ticket.estimateOriginalHours,
        spentHours: ticket.estimateSpentHours,
        remainingHours: ticket.estimateRemainingHours,
        storyPoints: ticket.storyPoints,
      },
    };
  }

  private normalizeTicketAccessPolicy(accessPolicy: unknown): TicketAccessPolicy {
    const source = (accessPolicy && typeof accessPolicy === 'object' ? accessPolicy : {}) as Record<string, unknown>;

    const getRoles = (key: TicketPermission): string[] => {
      const value = source[key];
      if (!Array.isArray(value)) {
        return [];
      }

      const normalized = value
        .filter((role): role is string => typeof role === 'string')
        .map((role) => role.trim())
        .filter(Boolean);

      return Array.from(new Set(normalized));
    };

    return {
      view: getRoles('view'),
      fill: getRoles('fill'),
      edit: getRoles('edit'),
      delete: getRoles('delete'),
      estimate: getRoles('estimate'),
      comment: getRoles('comment'),
      manageAccess: getRoles('manageAccess'),
    };
  }

  private canUseTicketPermission(
    accessPolicy: unknown,
    membership: BoardMembershipContext | { role: BoardMemberRole | null; customRoleName: string | null },
    permission: TicketPermission,
  ): boolean {
    if (!membership.role) {
      return false;
    }

    if (this.canManageTicketAccess(membership)) {
      return true;
    }

    const normalizedPolicy = this.normalizeTicketAccessPolicy(accessPolicy);
    const allowedRoles = normalizedPolicy[permission] ?? [];
    if (!allowedRoles.length) {
      return true;
    }

    const effectiveRoles = this.getEffectiveTicketRoles(membership);
    return allowedRoles.some((role) => effectiveRoles.has(role.toLowerCase()));
  }

  async findAll(userId?: string) {
    const boards = await this.prisma.board.findMany({
      where: userId
        ? {
            memberships: {
              some: { userId },
            },
          }
        : undefined,
      select: {
        id: true,
        title: true,
        description: true,
        logoUrl: true,
        themeColor: true,
        memberships: userId
          ? {
              where: { userId },
              select: { role: true, customRole: { select: { name: true } } },
              take: 1,
            }
          : false,
        tickets: {
          select: { id: true, accessPolicy: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return boards.map((b) => {
      const membership = b.memberships?.[0] as
        | { role: BoardMemberRole; customRole?: { name: string } | null }
        | undefined;
      const membershipRole = membership?.role ?? null;
      const customRoleName = membership?.customRole?.name ?? null;
      const visibleTickets = b.tickets.filter((t) =>
        this.canAccessTicket(t.accessPolicy, { role: membershipRole, customRoleName })
      );

      return {
        id: b.id,
        title: b.title,
        description: b.description ?? null,
        logoUrl: b.logoUrl ?? null,
        themeColor: b.themeColor ?? null,
        dashboardRole: membershipRole,
        tickets: visibleTickets.map((t) => ({ id: t.id })),
      };
    });
  }

  async findById(boardId: string, userId?: string, options?: FindBoardOptions) {
    const safeOffset = Math.max(0, options?.ticketsOffset ?? 0);
    const safeLimit = Math.min(Math.max(1, options?.ticketsLimit ?? 100), 250);

    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        ...(userId
          ? {
              memberships: {
                some: { userId },
              },
            }
          : {}),
      },
      select: {
        id: true,
        title: true,
        description: true,
        logoUrl: true,
        themeColor: true,
        memberships: userId
          ? {
              where: { userId },
              select: { role: true, customRole: { select: { name: true } } },
              take: 1,
            }
          : false,
        columns: {
          orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
          select: { id: true, title: true, position: true },
        },
        tickets: {
          skip: safeOffset,
          take: safeLimit,
          orderBy: [{ sortIndex: 'asc' }, { createdAt: 'asc' }],
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            sortIndex: true,
            priority: true,
            type: true,
            columnId: true,
            accessPolicy: true,
            createdAt: true,
            updatedAt: true,
            dueDate: true,
            estimateOriginalHours: true,
            estimateSpentHours: true,
            estimateRemainingHours: true,
            storyPoints: true,
            subtasks: {
              orderBy: { id: 'asc' },
              select: { id: true, title: true, done: true },
            },
            comments: {
              orderBy: { createdAt: 'desc' },
              select: {
                id: true,
                body: true,
                createdAt: true,
                author: {
                  select: {
                    name: true,
                    nickname: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!board) return null;

    const membership = board.memberships?.[0] as
      | { role: BoardMemberRole; customRole?: { name: string } | null }
      | undefined;
    const currentUserRole = membership?.role ?? null;
    const currentUserCustomRole = membership?.customRole?.name ?? null;
    const visibleTickets = board.tickets.filter((ticket) =>
      this.canAccessTicket(ticket.accessPolicy, { role: currentUserRole, customRoleName: currentUserCustomRole })
    );

    return {
      id: board.id,
      title: board.title,
      description: board.description ?? '',
      logoUrl: board.logoUrl ?? null,
      themeColor: board.themeColor || DEFAULT_THEME_COLOR,
      currentUserRole,
      currentUserCustomRoleName: currentUserCustomRole,
      columns: board.columns,
      tickets: visibleTickets.map((ticket) => this.mapTicket(ticket)),
    };
  }

  async create(dto: CreateBoardDto) {
    const title = dto.title?.trim();
    if (!title) throw new BadRequestException('title is required');

    const boardId = this.generateBoardId();
    const description = dto.description?.trim() || null;
    const logoUrl = dto.logoUrl?.trim() || null;
    const themeColor = dto.themeColor?.trim() || null;
    const columns = this.normalizeColumnTitles(dto.columns ?? []);
    const customRoles = this.normalizeRoleTitles(dto.customRoles ?? []);
    const ownerId = dto.ownerId?.trim() || null;
    const dashboardRole: BoardMemberRole = (dto.dashboardRole?.trim() || 'OWNER') as BoardMemberRole;

    await this.prisma.$transaction(async (tx) => {
      if (ownerId) {
        const owner = await tx.user.findUnique({ where: { id: ownerId }, select: { id: true } });
        if (!owner) {
          throw new BadRequestException('owner not found');
        }
      }

      await tx.board.create({
        data: { id: boardId, title, description, logoUrl, themeColor, ownerId },
      });

      for (let i = 0; i < columns.length; i++) {
        await tx.boardColumn.create({
          data: {
            id: `col-${boardId}-${i + 1}`,
            title: columns[i],
            position: i,
            boardId,
          },
        });
      }

      if (ownerId) {
        await tx.boardMember.create({
          data: {
            boardId,
            userId: ownerId,
            role: dashboardRole,
          },
        });
      }

      for (const roleName of customRoles) {
        await tx.boardRole.create({
          data: {
            boardId,
            name: roleName,
            permissions: [],
          },
        });
      }
    });

    return {
      id: boardId,
      title,
      description,
      logoUrl,
      themeColor,
      dashboardRole: ownerId ? dashboardRole : null,
      tickets: [],
    };
  }

  async deleteBoard(boardId: string, userId?: string) {
    const membership = await this.ensureBoardMembership(boardId, userId);
    if (membership.role !== BoardMemberRole.OWNER) {
      throw new BadRequestException('only board owner can delete board');
    }

    await this.prisma.board.delete({
      where: { id: boardId },
    });
  }

  async reorderColumns(boardId: string, dto: ReorderColumnsDto, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const { columnIds } = dto;
    if (!columnIds?.length) throw new BadRequestException('columnIds are required');

    const existing = await this.prisma.boardColumn.findMany({
      where: { boardId },
      select: { id: true },
    });

    if (existing.length !== columnIds.length) {
      throw new BadRequestException('columnIds count mismatch');
    }

    const existingSet = new Set(existing.map((c) => c.id));
    for (const id of columnIds) {
      if (!existingSet.has(id)) throw new BadRequestException('unknown column id');
    }

    await this.prisma.$transaction(
      columnIds.map((id, idx) =>
        this.prisma.boardColumn.update({
          where: { id },
          data: { position: idx, updatedAt: new Date() },
        }),
      ),
    );

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Колонки перемещены',
      message: 'Порядок колонок в борде был изменен',
    });

    this.emitBoardStateChanged(boardId, 'columns_changed', userId);
  }

  async createColumn(boardId: string, dto: CreateColumnDto, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const title = dto.title?.trim();
    if (!title) {
      throw new BadRequestException('title is required');
    }

    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true },
    });

    if (!board) {
      throw new BadRequestException('board not found');
    }

    const maxPosition = await this.prisma.boardColumn.aggregate({
      where: { boardId },
      _max: { position: true },
    });

    const position = (maxPosition._max.position ?? -1) + 1;
    const id = `col-${boardId}-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;

    const created = await this.prisma.boardColumn.create({
      data: {
        id,
        boardId,
        title,
        position,
      },
      select: {
        id: true,
        title: true,
        position: true,
      },
    });

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Колонка добавлена',
      message: `Добавлена новая колонка: ${created.title}`,
    });

    this.emitBoardStateChanged(boardId, 'columns_changed', userId);

    return created;
  }

  async renameColumn(boardId: string, columnId: string, dto: RenameColumnDto, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const title = dto.title?.trim();
    if (!title) throw new BadRequestException('title is required');

    const col = await this.prisma.boardColumn.findFirst({
      where: { id: columnId, boardId },
    });
    if (!col) throw new BadRequestException('column not found');

    await this.prisma.boardColumn.update({
      where: { id: columnId },
      data: { title, updatedAt: new Date() },
    });

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Колонка обновлена',
      message: `Название колонки изменено на: ${title}`,
    });

    this.emitBoardStateChanged(boardId, 'columns_changed', userId);
  }

  async deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const count = await this.prisma.boardColumn.count({ where: { boardId } });
    if (count <= 1) {
      throw new BadRequestException('at least one column must remain');
    }

    const col = await this.prisma.boardColumn.findFirst({
      where: { id: columnId, boardId },
    });
    if (!col) throw new BadRequestException('column not found');

    await this.prisma.$transaction(async (tx) => {
      if (dto.ticketIds?.length) {
        await tx.ticket.deleteMany({
          where: { boardId, id: { in: dto.ticketIds } },
        });
      }

      await tx.boardColumn.delete({ where: { id: columnId } });

      // Re-index positions after deletion
      const remaining = await tx.boardColumn.findMany({
        where: { boardId },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        select: { id: true },
      });

      for (let i = 0; i < remaining.length; i++) {
        await tx.boardColumn.update({
          where: { id: remaining[i].id },
          data: { position: i, updatedAt: new Date() },
        });
      }
    });

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Колонка удалена',
      message: `Удалена колонка: ${col.title}`,
    });

    this.emitBoardStateChanged(boardId, 'columns_changed', userId);
  }

  async createTicket(boardId: string, dto: CreateTicketDto, userId?: string) {
    const membership = await this.ensureBoardMembership(boardId, userId);

    const title = dto.title?.trim();
    if (!title) {
      throw new BadRequestException('title is required');
    }

    const status = dto.status?.trim() || 'todo';
    const type = dto.type?.trim() || 'task';
    const priority = dto.priority?.trim() || 'medium';
    const description = dto.description?.trim() || null;
    const columnId = dto.columnId?.trim() || null;

    if (dto.accessPolicy !== undefined && !this.canManageTicketAccess(membership)) {
      throw new BadRequestException('only OWNER or ADMIN can set ticket access policy');
    }

    const accessPolicy = this.normalizeTicketAccessPolicy(dto.accessPolicy);

    const estimateOriginalHours = dto.estimateOriginalHours ?? null;
    const estimateSpentHours = dto.estimateSpentHours ?? null;
    const estimateRemainingHours = dto.estimateRemainingHours ?? null;
    const storyPoints = dto.storyPoints ?? null;

    if (columnId) {
      const column = await this.prisma.boardColumn.findFirst({
        where: { id: columnId, boardId },
        select: { id: true },
      });
      if (!column) {
        throw new BadRequestException('column not found');
      }
    }

    const maxIndex = await this.prisma.ticket.aggregate({
      where: { boardId, status, columnId: columnId ?? undefined },
      _max: { sortIndex: true },
    });

    const sortIndex = (maxIndex._max.sortIndex ?? -1) + 1;
    const id = `T-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;

    const ticket = await this.prisma.ticket.create({
      data: {
        id,
        boardId,
        title,
        description,
        status,
        sortIndex,
        priority,
        type,
        columnId,
        accessPolicy,
        estimateOriginalHours,
        estimateSpentHours,
        estimateRemainingHours,
        storyPoints,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        sortIndex: true,
        priority: true,
        type: true,
        columnId: true,
        accessPolicy: true,
        createdAt: true,
        updatedAt: true,
        dueDate: true,
        estimateOriginalHours: true,
        estimateSpentHours: true,
        estimateRemainingHours: true,
        storyPoints: true,
        subtasks: {
          orderBy: { id: 'asc' },
          select: { id: true, title: true, done: true },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            body: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                nickname: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    const mappedTicket = this.mapTicket(ticket);

    await this.notifyTicketViewers(boardId, mappedTicket.id, ticket.accessPolicy, {
      actorUserId: userId,
      title: 'Новый тикет',
      message: `Создан тикет: ${mappedTicket.title}`,
    });

    this.emitBoardStateChanged(boardId, 'tickets_changed', userId);
    this.emitTicketStateChanged(boardId, mappedTicket.id, 'created', 'ticket', userId);

    return mappedTicket;
  }

  async getTicketById(boardId: string, ticketId: string, userId?: string) {
    const membership = await this.ensureBoardMembership(boardId, userId);

    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, boardId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        sortIndex: true,
        priority: true,
        type: true,
        columnId: true,
        accessPolicy: true,
        createdAt: true,
        updatedAt: true,
        dueDate: true,
        estimateOriginalHours: true,
        estimateSpentHours: true,
        estimateRemainingHours: true,
        storyPoints: true,
        subtasks: {
          orderBy: { id: 'asc' },
          select: { id: true, title: true, done: true },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            body: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                nickname: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException('ticket not found');
    }

    if (!this.canAccessTicket(ticket.accessPolicy, membership)) {
      throw new BadRequestException('ticket access denied');
    }

    return this.mapTicket(ticket);
  }

  async reorderTickets(boardId: string, dto: ReorderTicketsDto, userId?: string) {
    const membership = await this.ensureBoardMembership(boardId, userId);

    if (!dto.items?.length) {
      throw new BadRequestException('items are required');
    }

    const ids = dto.items.map((item) => item.id);
    const unique = new Set(ids);
    if (unique.size !== ids.length) {
      throw new BadRequestException('duplicate ticket id in items');
    }

    const existing = await this.prisma.ticket.findMany({
      where: { boardId, id: { in: ids } },
      select: { id: true, accessPolicy: true },
    });

    if (existing.length !== ids.length) {
      throw new BadRequestException('ticket ids mismatch');
    }

    for (const ticket of existing) {
      if (!this.canUseTicketPermission(ticket.accessPolicy, membership, 'edit')) {
        throw new BadRequestException('ticket access denied');
      }
    }

    await this.prisma.$transaction(
      dto.items.map((item) =>
        this.prisma.ticket.update({
          where: { id: item.id },
          data: {
            status: item.status,
            sortIndex: item.sortIndex,
            columnId: item.columnId ?? null,
            updatedAt: new Date(),
          },
        }),
      ),
    );

    if (dto.items.length > 0) {
      await this.notifyBoardMembers(boardId, {
        actorUserId: userId,
        title: 'Тикеты перемещены',
        message: 'Позиции тикетов в колонках были изменены',
      });

      this.emitBoardStateChanged(boardId, 'tickets_changed', userId);
      for (const item of dto.items) {
        this.emitTicketStateChanged(boardId, item.id, 'reordered', 'ticket', userId);
      }
    }
  }

  async updateTicket(boardId: string, ticketId: string, dto: UpdateTicketDto, userId?: string) {
    const membership = await this.ensureBoardMembership(boardId, userId);

    const existing = await this.prisma.ticket.findFirst({
      where: { id: ticketId, boardId },
      select: {
        id: true,
        status: true,
        columnId: true,
        sortIndex: true,
        accessPolicy: true,
        estimateOriginalHours: true,
        estimateSpentHours: true,
        estimateRemainingHours: true,
        storyPoints: true,
      },
    });

    if (!existing) {
      throw new BadRequestException('ticket not found');
    }

    if (!this.canAccessTicket(existing.accessPolicy, membership)) {
      throw new BadRequestException('ticket access denied');
    }

    const updatesContent =
      dto.title !== undefined ||
      dto.description !== undefined ||
      dto.type !== undefined ||
      dto.priority !== undefined;

    if (updatesContent && !this.canUseTicketPermission(existing.accessPolicy, membership, 'fill')) {
      throw new BadRequestException('ticket fill access denied');
    }

    const updatesStructure =
      dto.status !== undefined ||
      dto.columnId !== undefined ||
      dto.sortIndex !== undefined;

    if (updatesStructure && !this.canUseTicketPermission(existing.accessPolicy, membership, 'edit')) {
      throw new BadRequestException('ticket edit access denied');
    }

    const updatesEstimate =
      dto.estimateOriginalHours !== undefined ||
      dto.estimateSpentHours !== undefined ||
      dto.estimateRemainingHours !== undefined ||
      dto.storyPoints !== undefined;

    if (updatesEstimate && !this.canUseTicketPermission(existing.accessPolicy, membership, 'estimate')) {
      throw new BadRequestException('ticket estimate access denied');
    }

    if (dto.accessPolicy !== undefined && !this.canManageTicketAccess(membership)) {
      throw new BadRequestException('only OWNER or ADMIN can update ticket access policy');
    }

    const nextStatus = dto.status?.trim() ?? existing.status;
    const nextColumnId = dto.columnId !== undefined ? dto.columnId?.trim() || null : existing.columnId;

    if (nextColumnId) {
      const column = await this.prisma.boardColumn.findFirst({
        where: { id: nextColumnId, boardId },
        select: { id: true },
      });
      if (!column) {
        throw new BadRequestException('column not found');
      }
    }

    let sortIndex = dto.sortIndex;
    if (sortIndex === undefined && (nextStatus !== existing.status || nextColumnId !== existing.columnId)) {
      const maxIndex = await this.prisma.ticket.aggregate({
        where: { boardId, status: nextStatus, columnId: nextColumnId ?? undefined },
        _max: { sortIndex: true },
      });
      sortIndex = (maxIndex._max.sortIndex ?? -1) + 1;
    }

    const accessPolicy = dto.accessPolicy !== undefined
      ? this.normalizeTicketAccessPolicy(dto.accessPolicy)
      : undefined;

    const nextEstimateOriginalHours =
      dto.estimateOriginalHours !== undefined ? dto.estimateOriginalHours : existing.estimateOriginalHours;
    const nextEstimateSpentHours =
      dto.estimateSpentHours !== undefined ? dto.estimateSpentHours : existing.estimateSpentHours;
    const nextEstimateRemainingHours =
      dto.estimateRemainingHours !== undefined ? dto.estimateRemainingHours : existing.estimateRemainingHours;
    const nextStoryPoints = dto.storyPoints !== undefined ? dto.storyPoints : existing.storyPoints;

    const estimateChanges: EstimateFieldChange[] = [
      {
        label: 'Original hours',
        previous: existing.estimateOriginalHours,
        next: nextEstimateOriginalHours,
      },
      {
        label: 'Spent hours',
        previous: existing.estimateSpentHours,
        next: nextEstimateSpentHours,
      },
      {
        label: 'Remaining hours',
        previous: existing.estimateRemainingHours,
        next: nextEstimateRemainingHours,
      },
      {
        label: 'Story points',
        previous: existing.storyPoints,
        next: nextStoryPoints,
      },
    ].filter((change) => change.previous !== change.next);

    const shouldCreateEstimateChangeComment = updatesEstimate && estimateChanges.length > 0;

    const ticket = await this.prisma.ticket.update({
      where: { id: ticketId },
      data: {
        title: dto.title?.trim(),
        description: dto.description !== undefined ? dto.description.trim() || null : undefined,
        status: dto.status?.trim(),
        type: dto.type?.trim(),
        priority: dto.priority?.trim(),
        columnId: dto.columnId !== undefined ? nextColumnId : undefined,
        sortIndex,
        accessPolicy,
        estimateOriginalHours:
          dto.estimateOriginalHours !== undefined ? dto.estimateOriginalHours : undefined,
        estimateSpentHours:
          dto.estimateSpentHours !== undefined ? dto.estimateSpentHours : undefined,
        estimateRemainingHours:
          dto.estimateRemainingHours !== undefined ? dto.estimateRemainingHours : undefined,
        storyPoints: dto.storyPoints !== undefined ? dto.storyPoints : undefined,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        sortIndex: true,
        priority: true,
        type: true,
        columnId: true,
        accessPolicy: true,
        createdAt: true,
        updatedAt: true,
        dueDate: true,
        estimateOriginalHours: true,
        estimateSpentHours: true,
        estimateRemainingHours: true,
        storyPoints: true,
        subtasks: {
          orderBy: { id: 'asc' },
          select: { id: true, title: true, done: true },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            body: true,
            createdAt: true,
            author: {
              select: {
                name: true,
                nickname: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (shouldCreateEstimateChangeComment) {
      await this.prisma.comment.create({
        data: {
          ticketId,
          authorId: userId ?? null,
          body: this.buildEstimateChangeComment(estimateChanges),
        },
      });
    }

    const ticketWithComments = shouldCreateEstimateChangeComment
      ? await this.prisma.ticket.findFirst({
          where: { id: ticketId, boardId },
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            sortIndex: true,
            priority: true,
            type: true,
            columnId: true,
            accessPolicy: true,
            createdAt: true,
            updatedAt: true,
            dueDate: true,
            estimateOriginalHours: true,
            estimateSpentHours: true,
            estimateRemainingHours: true,
            storyPoints: true,
            subtasks: {
              orderBy: { id: 'asc' },
              select: { id: true, title: true, done: true },
            },
            comments: {
              orderBy: { createdAt: 'desc' },
              select: {
                id: true,
                body: true,
                createdAt: true,
                author: {
                  select: {
                    name: true,
                    nickname: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        })
      : ticket;

    if (!ticketWithComments) {
      throw new NotFoundException('ticket not found');
    }

    const mappedTicket = this.mapTicket(ticketWithComments);

    await this.notifyTicketViewers(boardId, mappedTicket.id, ticket.accessPolicy, {
      actorUserId: userId,
      title: 'Тикет обновлен',
      message: `Обновлен тикет: ${mappedTicket.title}`,
    });

    this.emitBoardStateChanged(boardId, 'tickets_changed', userId);
    this.emitTicketStateChanged(boardId, mappedTicket.id, 'updated', 'ticket', userId);

    return mappedTicket;
  }

  async createTicketComment(boardId: string, ticketId: string, dto: CreateTicketCommentDto, userId?: string) {
    const membership = await this.ensureBoardMembership(boardId, userId);

    const body = dto.body?.trim();
    if (!body) {
      throw new BadRequestException('comment body is required');
    }

    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, boardId },
      select: { id: true, accessPolicy: true },
    });

    if (!ticket) {
      throw new BadRequestException('ticket not found');
    }

    if (!this.canAccessTicket(ticket.accessPolicy, membership)) {
      throw new BadRequestException('ticket access denied');
    }

    if (!this.canUseTicketPermission(ticket.accessPolicy, membership, 'comment')) {
      throw new BadRequestException('ticket comment access denied');
    }

    const comment = await this.prisma.comment.create({
      data: {
        ticketId,
        authorId: userId ?? null,
        body,
      },
      select: {
        id: true,
        body: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            nickname: true,
            email: true,
            image: true,
          },
        },
      },
    });

    await this.notifyTicketViewers(boardId, ticketId, ticket.accessPolicy, {
      actorUserId: userId,
      title: 'Новый комментарий',
      message: 'В тикете появился новый комментарий',
    });

    this.emitTicketStateChanged(boardId, ticketId, 'updated', 'comment', userId);

    return this.mapTicketComment(comment);
  }

  async deleteTicket(boardId: string, ticketId: string, userId?: string) {
    const membership = await this.ensureBoardMembership(boardId, userId);

    const existing = await this.prisma.ticket.findFirst({
      where: { id: ticketId, boardId },
      select: { id: true, accessPolicy: true },
    });

    if (!existing) {
      throw new BadRequestException('ticket not found');
    }

    if (!this.canUseTicketPermission(existing.accessPolicy, membership, 'delete')) {
      throw new BadRequestException('ticket delete access denied');
    }

    await this.prisma.ticket.delete({ where: { id: ticketId } });

    await this.notifyTicketViewers(boardId, ticketId, existing.accessPolicy, {
      actorUserId: userId,
      title: 'Тикет удален',
      message: `Удален тикет: ${ticketId}`,
    });

    this.emitBoardStateChanged(boardId, 'tickets_changed', userId);
    this.emitTicketStateChanged(boardId, ticketId, 'deleted', 'ticket', userId);
  }

  private generateBoardId(): string {
    const randomHex = crypto.randomBytes(4).toString('hex');
    return `board-${Date.now()}-${randomHex}`;
  }

  private generateInvitationToken(): string {
    // Generate URL-safe token: "inv_" + random 24 hex chars
    const randomHex = crypto.randomBytes(12).toString('hex');
    return `inv_${randomHex}`;
  }

  private getInvitationExpiryDate(): Date {
    const ttlHours = Number(process.env.INVITE_EXPIRES_HOURS ?? '168');
    const safeHours = Number.isFinite(ttlHours) && ttlHours > 0 ? ttlHours : 168;
    return new Date(Date.now() + safeHours * 60 * 60 * 1000);
  }

  private getSharedInvitationMaxUses(): number {
    const maxUses = Number(process.env.INVITE_SHARED_MAX_USES ?? '10');
    return Number.isInteger(maxUses) && maxUses > 1 ? maxUses : 10;
  }

  private getInvitationState(invitation: Pick<InvitationRecord, 'type' | 'status' | 'expiresAt' | 'usedCount' | 'maxUses'>): InvitationState {
    if (invitation.status === 'declined') {
      return 'revoked';
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      return 'expired';
    }

    if (invitation.type === InvitationType.SHARED && invitation.usedCount >= invitation.maxUses) {
      return 'limit_reached';
    }

    if (invitation.status !== 'pending') {
      return 'accepted';
    }

    return 'pending';
  }

  private ensureInvitationCanBeAccepted(invitation: InvitationRecord): void {
    const state = this.getInvitationState(invitation);

    if (state === 'pending') {
      return;
    }

    if (state === 'revoked') {
      throw new BadRequestException('invitation is revoked');
    }

    if (state === 'expired') {
      throw new BadRequestException('invitation is expired');
    }

    if (state === 'limit_reached') {
      throw new BadRequestException('invitation limit reached');
    }

    throw new BadRequestException('invitation already accepted');
  }

  private mapInvitation(invitation: InvitationRecord) {
    return {
      id: invitation.id,
      boardId: invitation.boardId,
      type: invitation.type,
      email: invitation.email,
      customRoleId: invitation.customRoleId,
      customRoleName: invitation.customRoleName,
      createdByUserId: invitation.createdByUserId,
      status: invitation.status,
      state: this.getInvitationState(invitation),
      maxUses: invitation.maxUses,
      usedCount: invitation.usedCount,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      token: invitation.token,
      shareUrl: `/invite/${invitation.token}`,
    };
  }

  private async resolveInvitationCustomRole(boardId: string, customRoleId?: string | null) {
    const normalizedRoleId = customRoleId?.trim();
    if (!normalizedRoleId) {
      return { customRoleId: null, customRoleName: null };
    }

    const customRole = await this.prisma.boardRole.findFirst({
      where: { id: normalizedRoleId, boardId },
      select: { id: true, name: true },
    });

    if (!customRole) {
      throw new BadRequestException('custom role not found');
    }

    return {
      customRoleId: customRole.id,
      customRoleName: customRole.name,
    };
  }

  private async acceptInvitationRecord(invitation: InvitationRecord, userId?: string) {
    if (!userId) {
      throw new BadRequestException('user is required to accept invitation');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user?.email) {
      throw new BadRequestException('user email is required');
    }

    const existingMember = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId: invitation.boardId, userId } },
      select: { id: true },
    });

    if (existingMember) {
      if (invitation.type === InvitationType.PERSONAL) {
        await this.prisma.boardInvitation.updateMany({
          where: { id: invitation.id, status: 'pending' },
          data: { status: 'accepted', usedCount: invitation.maxUses },
        });
      }

      return { success: true, boardId: invitation.boardId, alreadyMember: true };
    }

    const userEmail = user.email.toLowerCase();

    if (invitation.type === InvitationType.PERSONAL) {
      const invitationEmail = invitation.email?.toLowerCase();
      if (!invitationEmail) {
        throw new BadRequestException('invitation email is missing');
      }
      if (invitationEmail !== userEmail) {
        throw new BadRequestException('invitation email mismatch');
      }
    }

    this.ensureInvitationCanBeAccepted(invitation);

    const result = await this.prisma.$transaction(async (tx) => {
      const existingMember = await tx.boardMember.findUnique({
        where: { boardId_userId: { boardId: invitation.boardId, userId } },
        select: { id: true },
      });

      if (existingMember) {
        if (invitation.type === InvitationType.PERSONAL) {
          await tx.boardInvitation.updateMany({
            where: { id: invitation.id, status: 'pending' },
            data: { status: 'accepted', usedCount: invitation.maxUses },
          });
        }

        return { success: true, boardId: invitation.boardId, alreadyMember: true };
      }

      if (invitation.customRoleId) {
        const customRole = await tx.boardRole.findFirst({
          where: { id: invitation.customRoleId, boardId: invitation.boardId },
          select: { id: true },
        });

        if (!customRole) {
          throw new BadRequestException('invitation custom role is missing');
        }
      }

      const reserved = await tx.boardInvitation.updateMany({
        where: {
          id: invitation.id,
          status: 'pending',
          expiresAt: { gt: new Date() },
          usedCount: { lt: invitation.maxUses },
        },
        data: {
          usedCount: { increment: 1 },
        },
      });

      if (reserved.count !== 1) {
        const latestInvitation = await tx.boardInvitation.findUnique({
          where: { id: invitation.id },
          select: {
            id: true,
            token: true,
            type: true,
            email: true,
            boardId: true,
            customRoleId: true,
            customRoleName: true,
            createdByUserId: true,
            status: true,
            maxUses: true,
            usedCount: true,
            expiresAt: true,
            createdAt: true,
          },
        });

        if (!latestInvitation) {
          throw new NotFoundException('invitation not found');
        }

        this.ensureInvitationCanBeAccepted(latestInvitation);
      }

      const currentInvitation = await tx.boardInvitation.findUnique({
        where: { id: invitation.id },
        select: { usedCount: true, maxUses: true },
      });

      if (!currentInvitation) {
        throw new NotFoundException('invitation not found');
      }

      if (currentInvitation.usedCount >= currentInvitation.maxUses) {
        await tx.boardInvitation.update({
          where: { id: invitation.id },
          data: { status: 'accepted' },
        });
      }

      await tx.boardMember.create({
        data: {
          boardId: invitation.boardId,
          userId,
          role: BoardMemberRole.MEMBER,
          customRoleId: invitation.customRoleId ?? null,
        },
      });

      return { success: true, boardId: invitation.boardId, alreadyMember: false };
    });

    return result;
  }

  private normalizeColumnTitles(columns: string[]): string[] {
    const seen = new Set<string>();
    const normalized: string[] = [];

    for (const col of columns) {
      const title = col.trim();
      if (!title) continue;
      const key = title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      normalized.push(title);
    }

    return normalized.length > 0 ? normalized : ['Backlog', 'In Progress', 'Done'];
  }

  private normalizeRoleTitles(roles: string[]): string[] {
    const seen = new Set<string>();
    const normalized: string[] = [];
    const reserved = new Set(['owner', 'admin', 'member', 'viewer']);

    for (const role of roles) {
      const title = role.trim();
      if (!title) continue;
      const key = title.toLowerCase();
      if (reserved.has(key)) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      normalized.push(title);
    }

    return normalized;
  }

  private async ensureBoardMembership(boardId: string, userId?: string): Promise<BoardMembershipContext> {
    if (!userId) {
      throw new BadRequestException('user is required');
    }

    const membership = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
      select: { id: true, role: true, customRole: { select: { name: true } } },
    });

    if (!membership) {
      throw new BadRequestException('board access denied');
    }

    return {
      role: membership.role,
      customRoleName: membership.customRole?.name ?? null,
    };
  }

  private canAccessTicket(
    accessPolicy: unknown,
    membership: BoardMembershipContext | { role: BoardMemberRole | null; customRoleName: string | null },
  ): boolean {
    return this.canUseTicketPermission(accessPolicy, membership, 'view');
  }

  private canManageTicketAccess(membership: BoardMembershipContext | { role: BoardMemberRole | null }): boolean {
    return membership.role === BoardMemberRole.OWNER || membership.role === BoardMemberRole.ADMIN;
  }

  private getEffectiveTicketRoles(membership: { role: BoardMemberRole | null; customRoleName: string | null }): Set<string> {
    const roles = new Set<string>();
    if (membership.role) {
      roles.add(membership.role.toLowerCase());
    }
    const customRoleName = membership.customRoleName?.trim().toLowerCase();
    if (customRoleName) {
      roles.add(customRoleName);
    }
    return roles;
  }

  async listBoardMembers(boardId: string, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const members = await this.prisma.boardMember.findMany({
      where: { boardId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        boardId: true,
        userId: true,
        role: true,
        customRoleId: true,
        customRole: { select: { name: true } },
        user: {
          select: {
            email: true,
            name: true,
            nickname: true,
          },
        },
      },
    });

    return members.map((member) => ({
      id: member.id,
      boardId: member.boardId,
      userId: member.userId,
      role: member.role,
      customRoleId: member.customRoleId,
      customRoleName: member.customRole?.name ?? null,
      email: member.user.email ?? null,
      name: member.user.name ?? null,
      nickname: member.user.nickname ?? null,
    }));
  }

  async updateBoardMemberCustomRole(
    boardId: string,
    memberId: string,
    dto: UpdateBoardMemberCustomRoleDto,
    userId?: string,
  ) {
    const membership = await this.ensureBoardMembership(boardId, userId);
    if (!this.canManageTicketAccess(membership)) {
      throw new BadRequestException('only OWNER or ADMIN can assign custom roles');
    }

    const member = await this.prisma.boardMember.findFirst({
      where: { id: memberId, boardId },
      select: { id: true, boardId: true, userId: true, role: true },
    });
    if (!member) {
      throw new BadRequestException('board member not found');
    }

    let customRoleId: string | null = null;
    if (dto.customRoleId !== undefined && dto.customRoleId !== null && dto.customRoleId.trim() !== '') {
      const customRole = await this.prisma.boardRole.findFirst({
        where: { id: dto.customRoleId.trim(), boardId },
        select: { id: true },
      });
      if (!customRole) {
        throw new BadRequestException('custom role not found');
      }
      customRoleId = customRole.id;
    }

    const updated = await this.prisma.boardMember.update({
      where: { id: memberId },
      data: { customRoleId },
      select: {
        id: true,
        boardId: true,
        userId: true,
        role: true,
        customRoleId: true,
        customRole: { select: { name: true } },
        user: {
          select: {
            email: true,
            name: true,
            nickname: true,
          },
        },
      },
    });

    const result = {
      id: updated.id,
      boardId: updated.boardId,
      userId: updated.userId,
      role: updated.role,
      customRoleId: updated.customRoleId,
      customRoleName: updated.customRole?.name ?? null,
      email: updated.user.email ?? null,
      name: updated.user.name ?? null,
      nickname: updated.user.nickname ?? null,
    };

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Роль участника изменена',
      message: `Обновлена роль участника: ${result.name ?? result.nickname ?? result.email ?? result.userId}`,
    });

    return result;
  }

  async leaveBoard(boardId: string, userId?: string) {
    const membership = await this.ensureBoardMembership(boardId, userId);

    if (membership.role === BoardMemberRole.OWNER) {
      throw new BadRequestException('board owner cannot leave board');
    }

    await this.prisma.boardMember.delete({
      where: { boardId_userId: { boardId, userId: userId! } },
    });

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Участник покинул борду',
      message: 'Один из участников покинул борду',
    });
  }

  async removeBoardMember(boardId: string, memberId: string, userId?: string) {
    const membership = await this.ensureBoardMembership(boardId, userId);
    if (!this.canManageTicketAccess(membership)) {
      throw new BadRequestException('only OWNER or ADMIN can remove board members');
    }

    const member = await this.prisma.boardMember.findFirst({
      where: { id: memberId, boardId },
      select: { id: true, userId: true, role: true },
    });

    if (!member) {
      throw new BadRequestException('board member not found');
    }

    if (member.role === BoardMemberRole.OWNER) {
      throw new BadRequestException('board owner cannot be removed');
    }

    if (userId && member.userId === userId) {
      throw new BadRequestException('you cannot remove yourself from board');
    }

    await this.prisma.boardMember.delete({
      where: { id: member.id },
    });

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Участник удален',
      message: 'Один из участников был удален из борды',
    });

    await this.createAndDispatchNotifications([member.userId], {
      kind: 'board',
      boardId,
      title: 'Доступ к борде отозван',
      message: 'Ваш доступ к борде был удален',
    });
  }

  async createBoardRole(boardId: string, dto: CreateBoardRoleDto, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException('role name is required');
    }

    const existing = await this.prisma.boardRole.findFirst({
      where: { boardId, name },
    });
    if (existing) {
      throw new BadRequestException('role with this name already exists');
    }

    const role = await this.prisma.boardRole.create({
      data: {
        boardId,
        name,
        permissions: dto.permissions ?? [],
      },
    });

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Создана новая роль',
      message: `Добавлена роль: ${role.name}`,
    });

    return role;
  }

  async updateBoardRole(boardId: string, roleId: string, dto: UpdateBoardRoleDto, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const existing = await this.prisma.boardRole.findFirst({
      where: { id: roleId, boardId },
    });
    if (!existing) {
      throw new BadRequestException('role not found');
    }

    const updateData: Partial<{ name: string; permissions: string[] }> = {};
    if (dto.name !== undefined) {
      const name = dto.name?.trim();
      if (!name) {
        throw new BadRequestException('role name cannot be empty');
      }
      const conflict = await this.prisma.boardRole.findFirst({
        where: { boardId, name, id: { not: roleId } },
      });
      if (conflict) {
        throw new BadRequestException('role with this name already exists');
      }
      updateData.name = name;
    }

    if (dto.permissions !== undefined) {
      updateData.permissions = dto.permissions;
    }

    const role = await this.prisma.boardRole.update({
      where: { id: roleId },
      data: updateData,
    });

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Роль обновлена',
      message: `Обновлена роль: ${role.name}`,
    });

    return role;
  }

  async deleteBoardRole(boardId: string, roleId: string, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const existing = await this.prisma.boardRole.findFirst({
      where: { id: roleId, boardId },
    });
    if (!existing) {
      throw new BadRequestException('role not found');
    }

    await this.prisma.boardRole.delete({
      where: { id: roleId },
    });

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Роль удалена',
      message: `Удалена роль: ${existing.name}`,
    });
  }

  async listBoardRoles(boardId: string, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const roles = await this.prisma.boardRole.findMany({
      where: { boardId },
      orderBy: { createdAt: 'asc' },
    });

    return roles;
  }

  async createBoardInvitation(boardId: string, dto: CreateBoardInvitationDto, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const { customRoleId, customRoleName } = await this.resolveInvitationCustomRole(
      boardId,
      dto.customRoleId,
    );
    const expiresAt = this.getInvitationExpiryDate();
    const token = this.generateInvitationToken();

    if (dto.type === InvitationType.PERSONAL) {
      const email = dto.email?.trim().toLowerCase();
      if (!email) {
        throw new BadRequestException('email is required for personal invitation');
      }

      const existingInvitation = await this.prisma.boardInvitation.findFirst({
        where: {
          boardId,
          type: InvitationType.PERSONAL,
          email,
          status: 'pending',
        },
        orderBy: { createdAt: 'desc' },
      });

      const invitation = existingInvitation
        ? await this.prisma.boardInvitation.update({
            where: { id: existingInvitation.id },
            data: {
              token,
              customRoleId,
              customRoleName,
              createdByUserId: userId ?? null,
              status: 'pending',
              maxUses: 1,
              usedCount: 0,
              expiresAt,
            },
          })
        : await this.prisma.boardInvitation.create({
            data: {
              token,
              type: InvitationType.PERSONAL,
              email,
              boardId,
              customRoleId,
              customRoleName,
              createdByUserId: userId ?? null,
              status: 'pending',
              maxUses: 1,
              usedCount: 0,
              expiresAt,
            },
          });

      const mapped = this.mapInvitation(invitation);

      await this.notifyBoardMembers(boardId, {
        actorUserId: userId,
        title: 'Новый инвайт',
        message: `Создан персональный инвайт для ${email}`,
      });

      return mapped;
    }

    const sharedInvitationMode = dto.sharedInvitationMode ?? SharedInvitationMode.SINGLE_USE;
    const maxUses =
      sharedInvitationMode === SharedInvitationMode.MULTI_USE
        ? this.getSharedInvitationMaxUses()
        : 1;

    const invitation = await this.prisma.boardInvitation.create({
      data: {
        token,
        type: InvitationType.SHARED,
        email: null,
        boardId,
        customRoleId,
        customRoleName,
        createdByUserId: userId ?? null,
        status: 'pending',
        maxUses,
        usedCount: 0,
        expiresAt,
      },
    });

    const mapped = this.mapInvitation(invitation);

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Новый инвайт',
      message: 'Создана новая shared invite-ссылка',
    });

    return mapped;
  }

  async listBoardInvitations(boardId: string, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const invitations = await this.prisma.boardInvitation.findMany({
      where: { boardId },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((invitation) => this.mapInvitation(invitation));
  }

  async acceptBoardInvitation(boardId: string, invitationId: string, userId?: string) {
    const invitation = await this.prisma.boardInvitation.findFirst({
      where: { id: invitationId, boardId },
    });

    if (!invitation) {
      throw new NotFoundException('invitation not found');
    }

    const accepted = await this.acceptInvitationRecord(invitation, userId);

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Инвайт принят',
      message: 'Новый участник присоединился к борде по приглашению',
    });

    return accepted;
  }

  async revokeBoardInvitation(boardId: string, invitationId: string, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const existing = await this.prisma.boardInvitation.findFirst({
      where: { id: invitationId, boardId },
      select: { id: true },
    });

    if (!existing) {
      throw new BadRequestException('invitation not found');
    }

    await this.prisma.boardInvitation.delete({
      where: { id: invitationId },
    });

    await this.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Инвайт удален',
      message: 'Одна из invite-ссылок была удалена',
    });
  }

  async getInvitationByToken(token: string) {
    const invitation = await this.prisma.boardInvitation.findUnique({
      where: { token },
      select: {
        id: true,
        token: true,
        type: true,
        email: true,
        boardId: true,
        customRoleId: true,
        customRoleName: true,
        createdByUserId: true,
        status: true,
        maxUses: true,
        usedCount: true,
        expiresAt: true,
        createdAt: true,
        board: {
          select: {
            id: true,
            title: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('invitation not found');
    }

    return {
      id: invitation.id,
      token: invitation.token,
      type: invitation.type,
      email: invitation.email,
      boardId: invitation.boardId,
      customRoleId: invitation.customRoleId,
      customRoleName: invitation.customRoleName,
      createdByUserId: invitation.createdByUserId,
      status: invitation.status,
      state: this.getInvitationState(invitation),
      maxUses: invitation.maxUses,
      usedCount: invitation.usedCount,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      board: invitation.board,
    };
  }

  async acceptInvitationByToken(token: string, userId?: string) {
    const invitation = await this.prisma.boardInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('invitation not found');
    }

    return this.acceptInvitationRecord(invitation, userId);
  }
}
