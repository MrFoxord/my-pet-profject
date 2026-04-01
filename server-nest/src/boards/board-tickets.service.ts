import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { BoardsAccessService } from './boards-access.service';
import { BoardNotificationsService } from './board-notifications.service';
import { DEFAULT_ASSIGNEE } from './boards.constants';
import {
  EstimateFieldChange,
  TicketCommentRecord,
  TicketRecord,
} from './boards.types';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class BoardTicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
    private readonly boardsAccessService: BoardsAccessService,
    private readonly boardNotificationsService: BoardNotificationsService,
  ) {}

  getTicketSelect() {
    return {
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
    } as const;
  }

  mapTicket(ticket: TicketRecord) {
    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description ?? '',
      type: ticket.type,
      priority: ticket.priority,
      status: ticket.status,
      sortIndex: ticket.sortIndex,
      columnId: ticket.columnId,
      accessPolicy: this.boardsAccessService.normalizeTicketAccessPolicy(ticket.accessPolicy),
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

  async createTicket(boardId: string, dto: CreateTicketDto, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);

    const title = dto.title?.trim();
    if (!title) {
      throw new BadRequestException('title is required');
    }

    const status = dto.status?.trim() || 'todo';
    const type = dto.type?.trim() || 'task';
    const priority = dto.priority?.trim() || 'medium';
    const description = dto.description?.trim() || null;
    const columnId = dto.columnId?.trim() || null;

    if (dto.accessPolicy !== undefined && !this.boardsAccessService.canManageTicketAccess(membership)) {
      throw new BadRequestException('only OWNER or ADMIN can set ticket access policy');
    }

    const accessPolicy = this.boardsAccessService.normalizeTicketAccessPolicy(dto.accessPolicy);
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
      select: this.getTicketSelect(),
    });

    const mappedTicket = this.mapTicket(ticket);

    await this.boardNotificationsService.notifyTicketViewers(boardId, mappedTicket.id, ticket.accessPolicy, {
      actorUserId: userId,
      title: 'Новый тикет',
      message: `Создан тикет: ${mappedTicket.title}`,
    });

    this.emitBoardStateChanged(boardId, 'tickets_changed', userId);
    this.emitTicketStateChanged(boardId, mappedTicket.id, 'created', 'ticket', userId);

    return mappedTicket;
  }

  async getTicketById(boardId: string, ticketId: string, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);

    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, boardId },
      select: this.getTicketSelect(),
    });

    if (!ticket) {
      throw new NotFoundException('ticket not found');
    }

    if (!this.boardsAccessService.canAccessTicket(ticket.accessPolicy, membership)) {
      throw new BadRequestException('ticket access denied');
    }

    return this.mapTicket(ticket);
  }

  async reorderTickets(boardId: string, dto: ReorderTicketsDto, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);

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
      if (!this.boardsAccessService.canUseTicketPermission(ticket.accessPolicy, membership, 'edit')) {
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
      await this.boardNotificationsService.notifyBoardMembers(boardId, {
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
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);

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

    if (!this.boardsAccessService.canAccessTicket(existing.accessPolicy, membership)) {
      throw new BadRequestException('ticket access denied');
    }

    const updatesContent =
      dto.title !== undefined ||
      dto.description !== undefined ||
      dto.type !== undefined ||
      dto.priority !== undefined;

    if (updatesContent && !this.boardsAccessService.canUseTicketPermission(existing.accessPolicy, membership, 'fill')) {
      throw new BadRequestException('ticket fill access denied');
    }

    const updatesStructure =
      dto.status !== undefined ||
      dto.columnId !== undefined ||
      dto.sortIndex !== undefined;

    if (updatesStructure && !this.boardsAccessService.canUseTicketPermission(existing.accessPolicy, membership, 'edit')) {
      throw new BadRequestException('ticket edit access denied');
    }

    const updatesEstimate =
      dto.estimateOriginalHours !== undefined ||
      dto.estimateSpentHours !== undefined ||
      dto.estimateRemainingHours !== undefined ||
      dto.storyPoints !== undefined;

    if (updatesEstimate && !this.boardsAccessService.canUseTicketPermission(existing.accessPolicy, membership, 'estimate')) {
      throw new BadRequestException('ticket estimate access denied');
    }

    if (dto.accessPolicy !== undefined && !this.boardsAccessService.canManageTicketAccess(membership)) {
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
      ? this.boardsAccessService.normalizeTicketAccessPolicy(dto.accessPolicy)
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
      select: this.getTicketSelect(),
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
          select: this.getTicketSelect(),
        })
      : ticket;

    if (!ticketWithComments) {
      throw new NotFoundException('ticket not found');
    }

    const mappedTicket = this.mapTicket(ticketWithComments);

    await this.boardNotificationsService.notifyTicketViewers(boardId, mappedTicket.id, ticket.accessPolicy, {
      actorUserId: userId,
      title: 'Тикет обновлен',
      message: `Обновлен тикет: ${mappedTicket.title}`,
    });

    this.emitBoardStateChanged(boardId, 'tickets_changed', userId);
    this.emitTicketStateChanged(boardId, mappedTicket.id, 'updated', 'ticket', userId);

    return mappedTicket;
  }

  async createTicketComment(boardId: string, ticketId: string, dto: CreateTicketCommentDto, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);

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

    if (!this.boardsAccessService.canAccessTicket(ticket.accessPolicy, membership)) {
      throw new BadRequestException('ticket access denied');
    }

    if (!this.boardsAccessService.canUseTicketPermission(ticket.accessPolicy, membership, 'comment')) {
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

    await this.boardNotificationsService.notifyTicketViewers(boardId, ticketId, ticket.accessPolicy, {
      actorUserId: userId,
      title: 'Новый комментарий',
      message: 'В тикете появился новый комментарий',
    });

    this.emitTicketStateChanged(boardId, ticketId, 'updated', 'comment', userId);

    return this.mapTicketComment(comment);
  }

  async deleteTicket(boardId: string, ticketId: string, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);

    const existing = await this.prisma.ticket.findFirst({
      where: { id: ticketId, boardId },
      select: { id: true, accessPolicy: true },
    });

    if (!existing) {
      throw new BadRequestException('ticket not found');
    }

    if (!this.boardsAccessService.canUseTicketPermission(existing.accessPolicy, membership, 'delete')) {
      throw new BadRequestException('ticket delete access denied');
    }

    await this.prisma.ticket.delete({ where: { id: ticketId } });

    await this.boardNotificationsService.notifyTicketViewers(boardId, ticketId, existing.accessPolicy, {
      actorUserId: userId,
      title: 'Тикет удален',
      message: `Удален тикет: ${ticketId}`,
    });

    this.emitBoardStateChanged(boardId, 'tickets_changed', userId);
    this.emitTicketStateChanged(boardId, ticketId, 'deleted', 'ticket', userId);
  }

  private formatEstimateValue(value: number | null) {
    return value === null ? 'none' : String(value);
  }

  private buildEstimateChangeComment(changes: EstimateFieldChange[]) {
    const parts = changes.map(
      (change) => `${change.label}: ${this.formatEstimateValue(change.previous)} -> ${this.formatEstimateValue(change.next)}`,
    );

    return `Estimate updated: ${parts.join('; ')}`;
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

  private emitBoardStateChanged(
    boardId: string,
    reason: 'tickets_changed',
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
}