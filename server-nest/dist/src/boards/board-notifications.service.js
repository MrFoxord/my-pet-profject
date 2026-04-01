"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardNotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const boards_access_service_1 = require("./boards-access.service");
let BoardNotificationsService = class BoardNotificationsService {
    constructor(prisma, realtimeGateway, boardsAccessService) {
        this.prisma = prisma;
        this.realtimeGateway = realtimeGateway;
        this.boardsAccessService = boardsAccessService;
    }
    async createAndDispatchNotifications(userIds, input) {
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
            }
            catch (error) {
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
    async notifyBoardMembers(boardId, input) {
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
    async notifyTicketViewers(boardId, ticketId, accessPolicy, input) {
        const members = await this.getBoardMemberContexts(boardId);
        const recipientIds = members
            .filter((member) => member.userId !== input.actorUserId)
            .filter((member) => this.boardsAccessService.canAccessTicket(accessPolicy, {
            role: member.role,
            customRoleName: member.customRole?.name ?? null,
            customRolePermissions: this.boardsAccessService.normalizeRolePermissions(member.customRole?.permissions ?? []),
        }))
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
    async listUserNotifications(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('user is required');
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
    async markNotificationRead(notificationId, userId) {
        if (!userId) {
            throw new common_1.BadRequestException('user is required');
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
            throw new common_1.BadRequestException('notification not found');
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
    async markAllNotificationsRead(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('user is required');
        }
        await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true, readAt: new Date() },
        });
        return { ok: true, unreadCount: 0 };
    }
    async getBoardMemberContexts(boardId) {
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
    mapNotification(notification) {
        const kind = notification.kind === 'ticket' ? 'ticket' : 'board';
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
};
exports.BoardNotificationsService = BoardNotificationsService;
exports.BoardNotificationsService = BoardNotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_gateway_1.RealtimeGateway,
        boards_access_service_1.BoardsAccessService])
], BoardNotificationsService);
//# sourceMappingURL=board-notifications.service.js.map