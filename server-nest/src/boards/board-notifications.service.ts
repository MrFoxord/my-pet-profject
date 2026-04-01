import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { BoardsAccessService } from './boards-access.service';
import { NotificationRecord } from './boards.types';

@Injectable()
export class BoardNotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeGateway: RealtimeGateway,
    private readonly boardsAccessService: BoardsAccessService,
  ) {}

  async createAndDispatchNotifications(
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

        this.realtimeGateway.emitNotificationToUsers([userId], {
          ...this.mapNotification(created),
          unreadCount,
        });
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

  async notifyBoardMembers(
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

  async notifyTicketViewers(
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
        this.boardsAccessService.canAccessTicket(accessPolicy, {
          role: member.role,
          customRoleName: member.customRole?.name ?? null,
          customRolePermissions: this.boardsAccessService.normalizeRolePermissions(member.customRole?.permissions ?? []),
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

  private async getBoardMemberContexts(boardId: string) {
    return this.prisma.boardMember.findMany({
      where: { boardId },
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
    });
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
}