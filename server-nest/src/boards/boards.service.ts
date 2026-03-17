import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { BoardMemberRole } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { CreateBoardInvitationDto } from './dto/create-board-invitation.dto';

const DEFAULT_THEME_COLOR = '#f3f4f6';
const DEFAULT_ASSIGNEE = {
  name: 'Unassigned',
  avatar: 'https://i.pravatar.cc/100?img=1',
};

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

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
              select: { role: true },
              take: 1,
            }
          : false,
        tickets: {
          select: { id: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    return boards.map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description ?? null,
      logoUrl: b.logoUrl ?? null,
      themeColor: b.themeColor ?? null,
      dashboardRole: b.memberships?.[0]?.role ?? null,
      tickets: b.tickets.map((t) => ({ id: t.id })),
    }));
  }

  async findById(boardId: string, userId?: string) {
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
              select: { role: true },
              take: 1,
            }
          : false,
        columns: {
          orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
          select: { id: true, title: true, position: true },
        },
        tickets: {
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
            accessibilityRoles: true,
            accessibilityIds: true,
            createdAt: true,
            updatedAt: true,
            dueDate: true,
            subtasks: {
              orderBy: { id: 'asc' },
              select: { id: true, title: true, done: true },
            },
          },
        },
      },
    });

    if (!board) return null;

    return {
      id: board.id,
      title: board.title,
      description: board.description ?? '',
      logoUrl: board.logoUrl ?? null,
      themeColor: board.themeColor || DEFAULT_THEME_COLOR,
      currentUserRole: board.memberships?.[0]?.role ?? null,
      columns: board.columns,
      tickets: board.tickets.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description ?? '',
        type: t.type,
        priority: t.priority,
        status: t.status,
        sortIndex: t.sortIndex,
        columnId: t.columnId,
        accessibilityRoles: t.accessibilityRoles,
        accessibilityIds: t.accessibilityIds,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        dueDate: t.dueDate?.toISOString() ?? '',
        assignee: DEFAULT_ASSIGNEE,
        subtasks: t.subtasks,
      })),
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

  async reorderColumns(boardId: string, dto: ReorderColumnsDto) {
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
  }

  async renameColumn(boardId: string, columnId: string, dto: RenameColumnDto) {
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
  }

  async deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto) {
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
  }

  async createTicket(boardId: string, dto: CreateTicketDto, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const title = dto.title?.trim();
    if (!title) {
      throw new BadRequestException('title is required');
    }

    const status = dto.status?.trim() || 'todo';
    const type = dto.type?.trim() || 'task';
    const priority = dto.priority?.trim() || 'medium';
    const description = dto.description?.trim() || null;
    const columnId = dto.columnId?.trim() || null;

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
        accessibilityRoles: dto.accessibilityRoles ?? [],
        accessibilityIds: dto.accessibilityIds ?? [],
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
        accessibilityRoles: true,
        accessibilityIds: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...ticket,
      description: ticket.description ?? '',
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      assignee: DEFAULT_ASSIGNEE,
      subtasks: [],
      dueDate: '',
    };
  }

  async reorderTickets(boardId: string, dto: ReorderTicketsDto, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

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
      select: { id: true },
    });

    if (existing.length !== ids.length) {
      throw new BadRequestException('ticket ids mismatch');
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
  }

  async updateTicket(boardId: string, ticketId: string, dto: UpdateTicketDto, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const existing = await this.prisma.ticket.findFirst({
      where: { id: ticketId, boardId },
      select: { id: true, status: true, columnId: true, sortIndex: true },
    });

    if (!existing) {
      throw new BadRequestException('ticket not found');
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
        accessibilityRoles: dto.accessibilityRoles,
        accessibilityIds: dto.accessibilityIds,
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
        accessibilityRoles: true,
        accessibilityIds: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      ...ticket,
      description: ticket.description ?? '',
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
      assignee: DEFAULT_ASSIGNEE,
      subtasks: [],
      dueDate: '',
    };
  }

  async deleteTicket(boardId: string, ticketId: string, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const existing = await this.prisma.ticket.findFirst({
      where: { id: ticketId, boardId },
      select: { id: true },
    });

    if (!existing) {
      throw new BadRequestException('ticket not found');
    }

    await this.prisma.ticket.delete({ where: { id: ticketId } });
  }

  private generateBoardId(): string {
    const randomHex = crypto.randomBytes(4).toString('hex');
    return `board-${Date.now()}-${randomHex}`;
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

  private async ensureBoardMembership(boardId: string, userId?: string) {
    if (!userId) {
      throw new BadRequestException('user is required');
    }

    const membership = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
      select: { id: true },
    });

    if (!membership) {
      throw new BadRequestException('board access denied');
    }
  }

  async createBoardRole(boardId: string, dto: any, userId?: string) {
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

    return role;
  }

  async updateBoardRole(boardId: string, roleId: string, dto: any, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    const existing = await this.prisma.boardRole.findFirst({
      where: { id: roleId, boardId },
    });
    if (!existing) {
      throw new BadRequestException('role not found');
    }

    const updateData: any = {};
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

    const email = dto.email.trim().toLowerCase();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const invitation = await this.prisma.boardInvitation.upsert({
      where: { boardId_email: { boardId, email } },
      create: {
        boardId,
        email,
        role: dto.role,
        status: 'pending',
        expiresAt,
      },
      update: {
        role: dto.role,
        status: 'pending',
        expiresAt,
      },
    });

    return invitation;
  }

  async listBoardInvitations(boardId: string, userId?: string) {
    await this.ensureBoardMembership(boardId, userId);

    return this.prisma.boardInvitation.findMany({
      where: { boardId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async acceptBoardInvitation(boardId: string, invitationId: string, userId?: string) {
    if (!userId) {
      throw new BadRequestException('user is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user?.email) {
      throw new BadRequestException('user email is required to accept invitation');
    }

    const invitation = await this.prisma.boardInvitation.findFirst({
      where: { id: invitationId, boardId },
    });

    if (!invitation) {
      throw new BadRequestException('invitation not found');
    }

    if (invitation.status !== 'pending') {
      throw new BadRequestException('invitation is not pending');
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      throw new BadRequestException('invitation is expired');
    }

    if (invitation.email !== user.email.toLowerCase()) {
      throw new BadRequestException('invitation email mismatch');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.boardMember.upsert({
        where: { boardId_userId: { boardId, userId } },
        create: {
          boardId,
          userId,
          role: invitation.role,
        },
        update: {
          role: invitation.role,
        },
      });

      await tx.boardInvitation.update({
        where: { id: invitation.id },
        data: { status: 'accepted' },
      });
    });

    return { ok: true };
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

    await this.prisma.boardInvitation.update({
      where: { id: invitationId },
      data: { status: 'declined' },
    });
  }
}
