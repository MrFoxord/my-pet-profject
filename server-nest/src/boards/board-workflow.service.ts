import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { BoardMemberRole, SharedInvitationMode } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { BoardsAccessService } from './boards-access.service';
import { BoardNotificationsService } from './board-notifications.service';
import { BoardStructureService } from './board-structure.service';
import { BoardTicketsService } from './board-tickets.service';
import { DEFAULT_THEME_COLOR } from './boards.constants';
import {
  ALL_TICKET_PERMISSIONS,
  FindBoardOptions,
} from './boards.types';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
    private readonly boardsAccessService: BoardsAccessService,
    private readonly boardNotificationsService: BoardNotificationsService,
    private readonly boardStructureService: BoardStructureService,
    private readonly boardTicketsService: BoardTicketsService,
  ) {}

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
        allowPersonalInvites: true,
        allowSharedInvites: true,
        defaultSharedInvitationMode: true,
        inviteExpiresHours: true,
        sharedInviteMaxUses: true,
        memberships: userId
          ? {
              where: { userId },
              select: { role: true, customRole: { select: { name: true, permissions: true } } },
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

    return boards.map((board) => {
      const membership = board.memberships?.[0] as
        | { role: BoardMemberRole; customRole?: { name: string; permissions: string[] } | null }
        | undefined;
      const membershipRole = membership?.role ?? null;
      const customRoleName = membership?.customRole?.name ?? null;
      const customRolePermissions = this.boardsAccessService.normalizeRolePermissions(
        membership?.customRole?.permissions ?? [],
      );
      const visibleTickets = board.tickets.filter((ticket) =>
        this.boardsAccessService.canAccessTicket(ticket.accessPolicy, {
          role: membershipRole,
          customRoleName,
          customRolePermissions,
        }),
      );

      return {
        id: board.id,
        title: board.title,
        description: board.description ?? null,
        logoUrl: board.logoUrl ?? null,
        themeColor: board.themeColor ?? null,
        allowPersonalInvites: board.allowPersonalInvites,
        allowSharedInvites: board.allowSharedInvites,
        defaultSharedInvitationMode: board.defaultSharedInvitationMode,
        inviteExpiresHours: board.inviteExpiresHours,
        sharedInviteMaxUses: board.sharedInviteMaxUses,
        dashboardRole: membershipRole,
        tickets: visibleTickets.map((ticket) => ({ id: ticket.id })),
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
        allowPersonalInvites: true,
        allowSharedInvites: true,
        defaultSharedInvitationMode: true,
        inviteExpiresHours: true,
        sharedInviteMaxUses: true,
        memberships: userId
          ? {
              where: { userId },
              select: { role: true, customRole: { select: { name: true, permissions: true } } },
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
          select: this.boardTicketsService.getTicketSelect(),
        },
      },
    });

    if (!board) {
      return null;
    }

    const membership = board.memberships?.[0] as
      | { role: BoardMemberRole; customRole?: { name: string; permissions: string[] } | null }
      | undefined;
    const currentUserRole = membership?.role ?? null;
    const currentUserCustomRole = membership?.customRole?.name ?? null;
    const currentUserCustomRolePermissions = this.boardsAccessService.normalizeRolePermissions(
      membership?.customRole?.permissions ?? [],
    );
    const visibleTickets = board.tickets.filter((ticket) =>
      this.boardsAccessService.canAccessTicket(ticket.accessPolicy, {
        role: currentUserRole,
        customRoleName: currentUserCustomRole,
        customRolePermissions: currentUserCustomRolePermissions,
      }),
    );

    return {
      id: board.id,
      title: board.title,
      description: board.description ?? '',
      logoUrl: board.logoUrl ?? null,
      themeColor: board.themeColor || DEFAULT_THEME_COLOR,
      allowPersonalInvites: board.allowPersonalInvites,
      allowSharedInvites: board.allowSharedInvites,
      defaultSharedInvitationMode: board.defaultSharedInvitationMode,
      inviteExpiresHours: board.inviteExpiresHours,
      sharedInviteMaxUses: board.sharedInviteMaxUses,
      currentUserRole,
      currentUserCustomRoleName: currentUserCustomRole,
      currentUserCustomRolePermissions,
      columns: board.columns,
      tickets: visibleTickets.map((ticket) => this.boardTicketsService.mapTicket(ticket)),
    };
  }

  async create(dto: CreateBoardDto) {
    const title = dto.title?.trim();
    if (!title) {
      throw new BadRequestException('title is required');
    }

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

      for (let index = 0; index < columns.length; index++) {
        await tx.boardColumn.create({
          data: {
            id: `col-${boardId}-${index + 1}`,
            title: columns[index],
            position: index,
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
            permissions: [...ALL_TICKET_PERMISSIONS],
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
      allowPersonalInvites: true,
      allowSharedInvites: true,
      defaultSharedInvitationMode: 'SINGLE_USE',
      inviteExpiresHours: 168,
      sharedInviteMaxUses: 10,
      dashboardRole: ownerId ? dashboardRole : null,
      tickets: [],
    };
  }

  async updateBoard(boardId: string, dto: UpdateBoardDto, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
    if (!this.boardsAccessService.canManageTicketAccess(membership)) {
      throw new BadRequestException('only OWNER or ADMIN can update board settings');
    }

    const existing = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('board not found');
    }

    const updateData: {
      title?: string;
      description?: string | null;
      themeColor?: string | null;
      logoUrl?: string | null;
      allowPersonalInvites?: boolean;
      allowSharedInvites?: boolean;
      defaultSharedInvitationMode?: SharedInvitationMode;
      inviteExpiresHours?: number;
      sharedInviteMaxUses?: number;
    } = {};

    if (dto.title !== undefined) {
      const title = dto.title.trim();
      if (!title) {
        throw new BadRequestException('title cannot be empty');
      }
      updateData.title = title;
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description?.trim() || null;
    }

    if (dto.themeColor !== undefined) {
      updateData.themeColor = dto.themeColor?.trim() || null;
    }

    if (dto.logoUrl !== undefined) {
      updateData.logoUrl = dto.logoUrl?.trim() || null;
    }

    if (dto.allowPersonalInvites !== undefined) {
      updateData.allowPersonalInvites = dto.allowPersonalInvites;
    }

    if (dto.allowSharedInvites !== undefined) {
      updateData.allowSharedInvites = dto.allowSharedInvites;
    }

    if (dto.defaultSharedInvitationMode !== undefined) {
      updateData.defaultSharedInvitationMode = dto.defaultSharedInvitationMode;
    }

    if (dto.inviteExpiresHours !== undefined) {
      updateData.inviteExpiresHours = dto.inviteExpiresHours;
    }

    if (dto.sharedInviteMaxUses !== undefined) {
      updateData.sharedInviteMaxUses = dto.sharedInviteMaxUses;
    }

    await this.prisma.board.update({
      where: { id: boardId },
      data: updateData,
    });

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Настройки борды обновлены',
      message: 'Изменены общие настройки борды',
    });

    this.emitBoardStateChanged(boardId, 'settings_changed', userId);

    return this.findById(boardId, userId);
  }

  async deleteBoard(boardId: string, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
    if (membership.role !== BoardMemberRole.OWNER) {
      throw new BadRequestException('only board owner can delete board');
    }

    await this.prisma.board.delete({
      where: { id: boardId },
    });
  }

  async reorderColumns(boardId: string, dto: ReorderColumnsDto, userId?: string) {
    return this.boardStructureService.reorderColumns(boardId, dto, userId);
  }

  async createColumn(boardId: string, dto: CreateColumnDto, userId?: string) {
    return this.boardStructureService.createColumn(boardId, dto, userId);
  }

  async renameColumn(boardId: string, columnId: string, dto: RenameColumnDto, userId?: string) {
    return this.boardStructureService.renameColumn(boardId, columnId, dto, userId);
  }

  async deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto, userId?: string) {
    return this.boardStructureService.deleteColumn(boardId, columnId, dto, userId);
  }

  async createTicket(boardId: string, dto: CreateTicketDto, userId?: string) {
    return this.boardTicketsService.createTicket(boardId, dto, userId);
  }

  async getTicketById(boardId: string, ticketId: string, userId?: string) {
    return this.boardTicketsService.getTicketById(boardId, ticketId, userId);
  }

  async reorderTickets(boardId: string, dto: ReorderTicketsDto, userId?: string) {
    return this.boardTicketsService.reorderTickets(boardId, dto, userId);
  }

  async updateTicket(boardId: string, ticketId: string, dto: UpdateTicketDto, userId?: string) {
    return this.boardTicketsService.updateTicket(boardId, ticketId, dto, userId);
  }

  async createTicketComment(boardId: string, ticketId: string, dto: CreateTicketCommentDto, userId?: string) {
    return this.boardTicketsService.createTicketComment(boardId, ticketId, dto, userId);
  }

  async deleteTicket(boardId: string, ticketId: string, userId?: string) {
    return this.boardTicketsService.deleteTicket(boardId, ticketId, userId);
  }

  private generateBoardId(): string {
    const randomHex = crypto.randomBytes(4).toString('hex');
    return `board-${Date.now()}-${randomHex}`;
  }

  private normalizeColumnTitles(columns: string[]): string[] {
    const seen = new Set<string>();
    const normalized: string[] = [];

    for (const column of columns) {
      const title = column.trim();
      if (!title) {
        continue;
      }

      const key = title.toLowerCase();
      if (seen.has(key)) {
        continue;
      }

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
      if (!title) {
        continue;
      }

      const key = title.toLowerCase();
      if (reserved.has(key) || seen.has(key)) {
        continue;
      }

      seen.add(key);
      normalized.push(title);
    }

    return normalized;
  }

  private emitBoardStateChanged(
    boardId: string,
    reason:
      | 'columns_changed'
      | 'tickets_changed'
      | 'members_changed'
      | 'roles_changed'
      | 'invitations_changed'
      | 'settings_changed',
    actorUserId?: string,
  ) {
    this.realtimeGateway.emitBoardStateChanged({
      boardId,
      reason,
      actorUserId,
    });
  }
}