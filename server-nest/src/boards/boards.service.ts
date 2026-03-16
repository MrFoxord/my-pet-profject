import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';

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
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            type: true,
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
    const ownerId = dto.ownerId?.trim() || null;
    const dashboardRole = dto.dashboardRole?.trim() || 'owner';

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
}
