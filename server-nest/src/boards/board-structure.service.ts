import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { BoardsAccessService } from './boards-access.service';
import { BoardNotificationsService } from './board-notifications.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';

@Injectable()
export class BoardStructureService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
    private readonly boardsAccessService: BoardsAccessService,
    private readonly boardNotificationsService: BoardNotificationsService,
  ) {}

  async reorderColumns(boardId: string, dto: ReorderColumnsDto, userId?: string) {
    await this.boardsAccessService.ensureBoardMembership(boardId, userId);

    const { columnIds } = dto;
    if (!columnIds?.length) {
      throw new BadRequestException('columnIds are required');
    }

    const existing = await this.prisma.boardColumn.findMany({
      where: { boardId },
      select: { id: true },
    });

    if (existing.length !== columnIds.length) {
      throw new BadRequestException('columnIds count mismatch');
    }

    const existingSet = new Set(existing.map((column) => column.id));
    for (const id of columnIds) {
      if (!existingSet.has(id)) {
        throw new BadRequestException('unknown column id');
      }
    }

    await this.prisma.$transaction(
      columnIds.map((id, idx) =>
        this.prisma.boardColumn.update({
          where: { id },
          data: { position: idx, updatedAt: new Date() },
        }),
      ),
    );

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Колонки перемещены',
      message: 'Порядок колонок в борде был изменен',
    });

    this.emitBoardStateChanged(boardId, 'columns_changed', userId);
  }

  async createColumn(boardId: string, dto: CreateColumnDto, userId?: string) {
    await this.boardsAccessService.ensureBoardMembership(boardId, userId);

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

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Колонка добавлена',
      message: `Добавлена новая колонка: ${created.title}`,
    });

    this.emitBoardStateChanged(boardId, 'columns_changed', userId);

    return created;
  }

  async renameColumn(boardId: string, columnId: string, dto: RenameColumnDto, userId?: string) {
    await this.boardsAccessService.ensureBoardMembership(boardId, userId);

    const title = dto.title?.trim();
    if (!title) {
      throw new BadRequestException('title is required');
    }

    const column = await this.prisma.boardColumn.findFirst({
      where: { id: columnId, boardId },
    });
    if (!column) {
      throw new BadRequestException('column not found');
    }

    await this.prisma.boardColumn.update({
      where: { id: columnId },
      data: { title, updatedAt: new Date() },
    });

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Колонка обновлена',
      message: `Название колонки изменено на: ${title}`,
    });

    this.emitBoardStateChanged(boardId, 'columns_changed', userId);
  }

  async deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto, userId?: string) {
    await this.boardsAccessService.ensureBoardMembership(boardId, userId);

    const count = await this.prisma.boardColumn.count({ where: { boardId } });
    if (count <= 1) {
      throw new BadRequestException('at least one column must remain');
    }

    const column = await this.prisma.boardColumn.findFirst({
      where: { id: columnId, boardId },
    });
    if (!column) {
      throw new BadRequestException('column not found');
    }

    await this.prisma.$transaction(async (tx) => {
      if (dto.ticketIds?.length) {
        await tx.ticket.deleteMany({
          where: { boardId, id: { in: dto.ticketIds } },
        });
      }

      await tx.boardColumn.delete({ where: { id: columnId } });

      const remaining = await tx.boardColumn.findMany({
        where: { boardId },
        orderBy: [{ position: 'asc' }, { createdAt: 'asc' }],
        select: { id: true },
      });

      for (let index = 0; index < remaining.length; index++) {
        await tx.boardColumn.update({
          where: { id: remaining[index].id },
          data: { position: index, updatedAt: new Date() },
        });
      }
    });

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Колонка удалена',
      message: `Удалена колонка: ${column.title}`,
    });

    this.emitBoardStateChanged(boardId, 'columns_changed', userId);
  }

  private emitBoardStateChanged(
    boardId: string,
    reason: 'columns_changed',
    actorUserId?: string,
  ) {
    this.realtimeGateway.emitBoardStateChanged({
      boardId,
      reason,
      actorUserId,
    });
  }
}