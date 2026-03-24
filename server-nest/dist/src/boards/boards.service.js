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
exports.BoardsService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const client_1 = require("../generated/prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const create_board_invitation_dto_1 = require("./dto/create-board-invitation.dto");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const DEFAULT_THEME_COLOR = '#f3f4f6';
const DEFAULT_ASSIGNEE = {
    name: 'Unassigned',
    avatar: 'https://i.pravatar.cc/100?img=1',
};
let BoardsService = class BoardsService {
    constructor(prisma, realtimeGateway) {
        this.prisma = prisma;
        this.realtimeGateway = realtimeGateway;
        this.standardTicketAccessRoles = new Set(['owner', 'admin', 'member', 'viewer']);
    }
    formatEstimateValue(value) {
        return value === null ? 'none' : String(value);
    }
    buildEstimateChangeComment(changes) {
        const parts = changes.map((change) => `${change.label}: ${this.formatEstimateValue(change.previous)} -> ${this.formatEstimateValue(change.next)}`);
        return `Estimate updated: ${parts.join('; ')}`;
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
    async getBoardMemberContexts(boardId) {
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
    emitBoardStateChanged(boardId, reason, actorUserId) {
        this.realtimeGateway.emitBoardStateChanged({
            boardId,
            reason,
            actorUserId,
        });
    }
    emitTicketStateChanged(boardId, ticketId, action, source, actorUserId) {
        this.realtimeGateway.emitTicketStateChanged({
            boardId,
            ticketId,
            action,
            source,
            actorUserId,
        });
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
            .filter((member) => this.canAccessTicket(accessPolicy, {
            role: member.role,
            customRoleName: member.customRole?.name ?? null,
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
    mapTicketComment(comment) {
        return {
            id: comment.id,
            message: comment.body,
            createdAt: comment.createdAt.toISOString(),
            author: {
                name: comment.author?.name?.trim() ||
                    comment.author?.nickname?.trim() ||
                    comment.author?.email?.trim() ||
                    'Unknown user',
                avatar: comment.author?.image?.trim() || DEFAULT_ASSIGNEE.avatar,
            },
        };
    }
    mapTicket(ticket) {
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
    normalizeTicketAccessPolicy(accessPolicy) {
        const source = (accessPolicy && typeof accessPolicy === 'object' ? accessPolicy : {});
        const getRoles = (key) => {
            const value = source[key];
            if (!Array.isArray(value)) {
                return [];
            }
            const normalized = value
                .filter((role) => typeof role === 'string')
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
    canUseTicketPermission(accessPolicy, membership, permission) {
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
    async findAll(userId) {
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
            const membership = b.memberships?.[0];
            const membershipRole = membership?.role ?? null;
            const customRoleName = membership?.customRole?.name ?? null;
            const visibleTickets = b.tickets.filter((t) => this.canAccessTicket(t.accessPolicy, { role: membershipRole, customRoleName }));
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
    async findById(boardId, userId, options) {
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
        if (!board)
            return null;
        const membership = board.memberships?.[0];
        const currentUserRole = membership?.role ?? null;
        const currentUserCustomRole = membership?.customRole?.name ?? null;
        const visibleTickets = board.tickets.filter((ticket) => this.canAccessTicket(ticket.accessPolicy, { role: currentUserRole, customRoleName: currentUserCustomRole }));
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
    async create(dto) {
        const title = dto.title?.trim();
        if (!title)
            throw new common_1.BadRequestException('title is required');
        const boardId = this.generateBoardId();
        const description = dto.description?.trim() || null;
        const logoUrl = dto.logoUrl?.trim() || null;
        const themeColor = dto.themeColor?.trim() || null;
        const columns = this.normalizeColumnTitles(dto.columns ?? []);
        const customRoles = this.normalizeRoleTitles(dto.customRoles ?? []);
        const ownerId = dto.ownerId?.trim() || null;
        const dashboardRole = (dto.dashboardRole?.trim() || 'OWNER');
        await this.prisma.$transaction(async (tx) => {
            if (ownerId) {
                const owner = await tx.user.findUnique({ where: { id: ownerId }, select: { id: true } });
                if (!owner) {
                    throw new common_1.BadRequestException('owner not found');
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
    async deleteBoard(boardId, userId) {
        const membership = await this.ensureBoardMembership(boardId, userId);
        if (membership.role !== client_1.BoardMemberRole.OWNER) {
            throw new common_1.BadRequestException('only board owner can delete board');
        }
        await this.prisma.board.delete({
            where: { id: boardId },
        });
    }
    async reorderColumns(boardId, dto, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const { columnIds } = dto;
        if (!columnIds?.length)
            throw new common_1.BadRequestException('columnIds are required');
        const existing = await this.prisma.boardColumn.findMany({
            where: { boardId },
            select: { id: true },
        });
        if (existing.length !== columnIds.length) {
            throw new common_1.BadRequestException('columnIds count mismatch');
        }
        const existingSet = new Set(existing.map((c) => c.id));
        for (const id of columnIds) {
            if (!existingSet.has(id))
                throw new common_1.BadRequestException('unknown column id');
        }
        await this.prisma.$transaction(columnIds.map((id, idx) => this.prisma.boardColumn.update({
            where: { id },
            data: { position: idx, updatedAt: new Date() },
        })));
        await this.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Колонки перемещены',
            message: 'Порядок колонок в борде был изменен',
        });
        this.emitBoardStateChanged(boardId, 'columns_changed', userId);
    }
    async createColumn(boardId, dto, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const title = dto.title?.trim();
        if (!title) {
            throw new common_1.BadRequestException('title is required');
        }
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            select: { id: true },
        });
        if (!board) {
            throw new common_1.BadRequestException('board not found');
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
    async renameColumn(boardId, columnId, dto, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const title = dto.title?.trim();
        if (!title)
            throw new common_1.BadRequestException('title is required');
        const col = await this.prisma.boardColumn.findFirst({
            where: { id: columnId, boardId },
        });
        if (!col)
            throw new common_1.BadRequestException('column not found');
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
    async deleteColumn(boardId, columnId, dto, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const count = await this.prisma.boardColumn.count({ where: { boardId } });
        if (count <= 1) {
            throw new common_1.BadRequestException('at least one column must remain');
        }
        const col = await this.prisma.boardColumn.findFirst({
            where: { id: columnId, boardId },
        });
        if (!col)
            throw new common_1.BadRequestException('column not found');
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
    async createTicket(boardId, dto, userId) {
        const membership = await this.ensureBoardMembership(boardId, userId);
        const title = dto.title?.trim();
        if (!title) {
            throw new common_1.BadRequestException('title is required');
        }
        const status = dto.status?.trim() || 'todo';
        const type = dto.type?.trim() || 'task';
        const priority = dto.priority?.trim() || 'medium';
        const description = dto.description?.trim() || null;
        const columnId = dto.columnId?.trim() || null;
        if (dto.accessPolicy !== undefined && !this.canManageTicketAccess(membership)) {
            throw new common_1.BadRequestException('only OWNER or ADMIN can set ticket access policy');
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
                throw new common_1.BadRequestException('column not found');
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
    async getTicketById(boardId, ticketId, userId) {
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
            throw new common_1.NotFoundException('ticket not found');
        }
        if (!this.canAccessTicket(ticket.accessPolicy, membership)) {
            throw new common_1.BadRequestException('ticket access denied');
        }
        return this.mapTicket(ticket);
    }
    async reorderTickets(boardId, dto, userId) {
        const membership = await this.ensureBoardMembership(boardId, userId);
        if (!dto.items?.length) {
            throw new common_1.BadRequestException('items are required');
        }
        const ids = dto.items.map((item) => item.id);
        const unique = new Set(ids);
        if (unique.size !== ids.length) {
            throw new common_1.BadRequestException('duplicate ticket id in items');
        }
        const existing = await this.prisma.ticket.findMany({
            where: { boardId, id: { in: ids } },
            select: { id: true, accessPolicy: true },
        });
        if (existing.length !== ids.length) {
            throw new common_1.BadRequestException('ticket ids mismatch');
        }
        for (const ticket of existing) {
            if (!this.canUseTicketPermission(ticket.accessPolicy, membership, 'edit')) {
                throw new common_1.BadRequestException('ticket access denied');
            }
        }
        await this.prisma.$transaction(dto.items.map((item) => this.prisma.ticket.update({
            where: { id: item.id },
            data: {
                status: item.status,
                sortIndex: item.sortIndex,
                columnId: item.columnId ?? null,
                updatedAt: new Date(),
            },
        })));
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
    async updateTicket(boardId, ticketId, dto, userId) {
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
            throw new common_1.BadRequestException('ticket not found');
        }
        if (!this.canAccessTicket(existing.accessPolicy, membership)) {
            throw new common_1.BadRequestException('ticket access denied');
        }
        const updatesContent = dto.title !== undefined ||
            dto.description !== undefined ||
            dto.type !== undefined ||
            dto.priority !== undefined;
        if (updatesContent && !this.canUseTicketPermission(existing.accessPolicy, membership, 'fill')) {
            throw new common_1.BadRequestException('ticket fill access denied');
        }
        const updatesStructure = dto.status !== undefined ||
            dto.columnId !== undefined ||
            dto.sortIndex !== undefined;
        if (updatesStructure && !this.canUseTicketPermission(existing.accessPolicy, membership, 'edit')) {
            throw new common_1.BadRequestException('ticket edit access denied');
        }
        const updatesEstimate = dto.estimateOriginalHours !== undefined ||
            dto.estimateSpentHours !== undefined ||
            dto.estimateRemainingHours !== undefined ||
            dto.storyPoints !== undefined;
        if (updatesEstimate && !this.canUseTicketPermission(existing.accessPolicy, membership, 'estimate')) {
            throw new common_1.BadRequestException('ticket estimate access denied');
        }
        if (dto.accessPolicy !== undefined && !this.canManageTicketAccess(membership)) {
            throw new common_1.BadRequestException('only OWNER or ADMIN can update ticket access policy');
        }
        const nextStatus = dto.status?.trim() ?? existing.status;
        const nextColumnId = dto.columnId !== undefined ? dto.columnId?.trim() || null : existing.columnId;
        if (nextColumnId) {
            const column = await this.prisma.boardColumn.findFirst({
                where: { id: nextColumnId, boardId },
                select: { id: true },
            });
            if (!column) {
                throw new common_1.BadRequestException('column not found');
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
        const nextEstimateOriginalHours = dto.estimateOriginalHours !== undefined ? dto.estimateOriginalHours : existing.estimateOriginalHours;
        const nextEstimateSpentHours = dto.estimateSpentHours !== undefined ? dto.estimateSpentHours : existing.estimateSpentHours;
        const nextEstimateRemainingHours = dto.estimateRemainingHours !== undefined ? dto.estimateRemainingHours : existing.estimateRemainingHours;
        const nextStoryPoints = dto.storyPoints !== undefined ? dto.storyPoints : existing.storyPoints;
        const estimateChanges = [
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
                estimateOriginalHours: dto.estimateOriginalHours !== undefined ? dto.estimateOriginalHours : undefined,
                estimateSpentHours: dto.estimateSpentHours !== undefined ? dto.estimateSpentHours : undefined,
                estimateRemainingHours: dto.estimateRemainingHours !== undefined ? dto.estimateRemainingHours : undefined,
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
            throw new common_1.NotFoundException('ticket not found');
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
    async createTicketComment(boardId, ticketId, dto, userId) {
        const membership = await this.ensureBoardMembership(boardId, userId);
        const body = dto.body?.trim();
        if (!body) {
            throw new common_1.BadRequestException('comment body is required');
        }
        const ticket = await this.prisma.ticket.findFirst({
            where: { id: ticketId, boardId },
            select: { id: true, accessPolicy: true },
        });
        if (!ticket) {
            throw new common_1.BadRequestException('ticket not found');
        }
        if (!this.canAccessTicket(ticket.accessPolicy, membership)) {
            throw new common_1.BadRequestException('ticket access denied');
        }
        if (!this.canUseTicketPermission(ticket.accessPolicy, membership, 'comment')) {
            throw new common_1.BadRequestException('ticket comment access denied');
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
    async deleteTicket(boardId, ticketId, userId) {
        const membership = await this.ensureBoardMembership(boardId, userId);
        const existing = await this.prisma.ticket.findFirst({
            where: { id: ticketId, boardId },
            select: { id: true, accessPolicy: true },
        });
        if (!existing) {
            throw new common_1.BadRequestException('ticket not found');
        }
        if (!this.canUseTicketPermission(existing.accessPolicy, membership, 'delete')) {
            throw new common_1.BadRequestException('ticket delete access denied');
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
    generateBoardId() {
        const randomHex = crypto.randomBytes(4).toString('hex');
        return `board-${Date.now()}-${randomHex}`;
    }
    generateInvitationToken() {
        const randomHex = crypto.randomBytes(12).toString('hex');
        return `inv_${randomHex}`;
    }
    getInvitationExpiryDate() {
        const ttlHours = Number(process.env.INVITE_EXPIRES_HOURS ?? '168');
        const safeHours = Number.isFinite(ttlHours) && ttlHours > 0 ? ttlHours : 168;
        return new Date(Date.now() + safeHours * 60 * 60 * 1000);
    }
    getSharedInvitationMaxUses() {
        const maxUses = Number(process.env.INVITE_SHARED_MAX_USES ?? '10');
        return Number.isInteger(maxUses) && maxUses > 1 ? maxUses : 10;
    }
    getInvitationState(invitation) {
        if (invitation.status === 'declined') {
            return 'revoked';
        }
        if (invitation.expiresAt.getTime() < Date.now()) {
            return 'expired';
        }
        if (invitation.type === client_1.InvitationType.SHARED && invitation.usedCount >= invitation.maxUses) {
            return 'limit_reached';
        }
        if (invitation.status !== 'pending') {
            return 'accepted';
        }
        return 'pending';
    }
    ensureInvitationCanBeAccepted(invitation) {
        const state = this.getInvitationState(invitation);
        if (state === 'pending') {
            return;
        }
        if (state === 'revoked') {
            throw new common_1.BadRequestException('invitation is revoked');
        }
        if (state === 'expired') {
            throw new common_1.BadRequestException('invitation is expired');
        }
        if (state === 'limit_reached') {
            throw new common_1.BadRequestException('invitation limit reached');
        }
        throw new common_1.BadRequestException('invitation already accepted');
    }
    mapInvitation(invitation) {
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
    async resolveInvitationCustomRole(boardId, customRoleId) {
        const normalizedRoleId = customRoleId?.trim();
        if (!normalizedRoleId) {
            return { customRoleId: null, customRoleName: null };
        }
        const customRole = await this.prisma.boardRole.findFirst({
            where: { id: normalizedRoleId, boardId },
            select: { id: true, name: true },
        });
        if (!customRole) {
            throw new common_1.BadRequestException('custom role not found');
        }
        return {
            customRoleId: customRole.id,
            customRoleName: customRole.name,
        };
    }
    async acceptInvitationRecord(invitation, userId) {
        if (!userId) {
            throw new common_1.BadRequestException('user is required to accept invitation');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user?.email) {
            throw new common_1.BadRequestException('user email is required');
        }
        const existingMember = await this.prisma.boardMember.findUnique({
            where: { boardId_userId: { boardId: invitation.boardId, userId } },
            select: { id: true },
        });
        if (existingMember) {
            if (invitation.type === client_1.InvitationType.PERSONAL) {
                await this.prisma.boardInvitation.updateMany({
                    where: { id: invitation.id, status: 'pending' },
                    data: { status: 'accepted', usedCount: invitation.maxUses },
                });
            }
            return { success: true, boardId: invitation.boardId, alreadyMember: true };
        }
        const userEmail = user.email.toLowerCase();
        if (invitation.type === client_1.InvitationType.PERSONAL) {
            const invitationEmail = invitation.email?.toLowerCase();
            if (!invitationEmail) {
                throw new common_1.BadRequestException('invitation email is missing');
            }
            if (invitationEmail !== userEmail) {
                throw new common_1.BadRequestException('invitation email mismatch');
            }
        }
        this.ensureInvitationCanBeAccepted(invitation);
        const result = await this.prisma.$transaction(async (tx) => {
            const existingMember = await tx.boardMember.findUnique({
                where: { boardId_userId: { boardId: invitation.boardId, userId } },
                select: { id: true },
            });
            if (existingMember) {
                if (invitation.type === client_1.InvitationType.PERSONAL) {
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
                    throw new common_1.BadRequestException('invitation custom role is missing');
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
                    throw new common_1.NotFoundException('invitation not found');
                }
                this.ensureInvitationCanBeAccepted(latestInvitation);
            }
            const currentInvitation = await tx.boardInvitation.findUnique({
                where: { id: invitation.id },
                select: { usedCount: true, maxUses: true },
            });
            if (!currentInvitation) {
                throw new common_1.NotFoundException('invitation not found');
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
                    role: client_1.BoardMemberRole.MEMBER,
                    customRoleId: invitation.customRoleId ?? null,
                },
            });
            return { success: true, boardId: invitation.boardId, alreadyMember: false };
        });
        return result;
    }
    normalizeColumnTitles(columns) {
        const seen = new Set();
        const normalized = [];
        for (const col of columns) {
            const title = col.trim();
            if (!title)
                continue;
            const key = title.toLowerCase();
            if (seen.has(key))
                continue;
            seen.add(key);
            normalized.push(title);
        }
        return normalized.length > 0 ? normalized : ['Backlog', 'In Progress', 'Done'];
    }
    normalizeRoleTitles(roles) {
        const seen = new Set();
        const normalized = [];
        const reserved = new Set(['owner', 'admin', 'member', 'viewer']);
        for (const role of roles) {
            const title = role.trim();
            if (!title)
                continue;
            const key = title.toLowerCase();
            if (reserved.has(key))
                continue;
            if (seen.has(key))
                continue;
            seen.add(key);
            normalized.push(title);
        }
        return normalized;
    }
    async ensureBoardMembership(boardId, userId) {
        if (!userId) {
            throw new common_1.BadRequestException('user is required');
        }
        const membership = await this.prisma.boardMember.findUnique({
            where: { boardId_userId: { boardId, userId } },
            select: { id: true, role: true, customRole: { select: { name: true } } },
        });
        if (!membership) {
            throw new common_1.BadRequestException('board access denied');
        }
        return {
            role: membership.role,
            customRoleName: membership.customRole?.name ?? null,
        };
    }
    canAccessTicket(accessPolicy, membership) {
        return this.canUseTicketPermission(accessPolicy, membership, 'view');
    }
    canManageTicketAccess(membership) {
        return membership.role === client_1.BoardMemberRole.OWNER || membership.role === client_1.BoardMemberRole.ADMIN;
    }
    getEffectiveTicketRoles(membership) {
        const roles = new Set();
        if (membership.role) {
            roles.add(membership.role.toLowerCase());
        }
        const customRoleName = membership.customRoleName?.trim().toLowerCase();
        if (customRoleName) {
            roles.add(customRoleName);
        }
        return roles;
    }
    async listBoardMembers(boardId, userId) {
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
    async updateBoardMemberCustomRole(boardId, memberId, dto, userId) {
        const membership = await this.ensureBoardMembership(boardId, userId);
        if (!this.canManageTicketAccess(membership)) {
            throw new common_1.BadRequestException('only OWNER or ADMIN can assign custom roles');
        }
        const member = await this.prisma.boardMember.findFirst({
            where: { id: memberId, boardId },
            select: { id: true, boardId: true, userId: true, role: true },
        });
        if (!member) {
            throw new common_1.BadRequestException('board member not found');
        }
        let customRoleId = null;
        if (dto.customRoleId !== undefined && dto.customRoleId !== null && dto.customRoleId.trim() !== '') {
            const customRole = await this.prisma.boardRole.findFirst({
                where: { id: dto.customRoleId.trim(), boardId },
                select: { id: true },
            });
            if (!customRole) {
                throw new common_1.BadRequestException('custom role not found');
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
    async leaveBoard(boardId, userId) {
        const membership = await this.ensureBoardMembership(boardId, userId);
        if (membership.role === client_1.BoardMemberRole.OWNER) {
            throw new common_1.BadRequestException('board owner cannot leave board');
        }
        await this.prisma.boardMember.delete({
            where: { boardId_userId: { boardId, userId: userId } },
        });
        await this.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Участник покинул борду',
            message: 'Один из участников покинул борду',
        });
    }
    async removeBoardMember(boardId, memberId, userId) {
        const membership = await this.ensureBoardMembership(boardId, userId);
        if (!this.canManageTicketAccess(membership)) {
            throw new common_1.BadRequestException('only OWNER or ADMIN can remove board members');
        }
        const member = await this.prisma.boardMember.findFirst({
            where: { id: memberId, boardId },
            select: { id: true, userId: true, role: true },
        });
        if (!member) {
            throw new common_1.BadRequestException('board member not found');
        }
        if (member.role === client_1.BoardMemberRole.OWNER) {
            throw new common_1.BadRequestException('board owner cannot be removed');
        }
        if (userId && member.userId === userId) {
            throw new common_1.BadRequestException('you cannot remove yourself from board');
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
    async createBoardRole(boardId, dto, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const name = dto.name?.trim();
        if (!name) {
            throw new common_1.BadRequestException('role name is required');
        }
        const existing = await this.prisma.boardRole.findFirst({
            where: { boardId, name },
        });
        if (existing) {
            throw new common_1.BadRequestException('role with this name already exists');
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
    async updateBoardRole(boardId, roleId, dto, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const existing = await this.prisma.boardRole.findFirst({
            where: { id: roleId, boardId },
        });
        if (!existing) {
            throw new common_1.BadRequestException('role not found');
        }
        const updateData = {};
        if (dto.name !== undefined) {
            const name = dto.name?.trim();
            if (!name) {
                throw new common_1.BadRequestException('role name cannot be empty');
            }
            const conflict = await this.prisma.boardRole.findFirst({
                where: { boardId, name, id: { not: roleId } },
            });
            if (conflict) {
                throw new common_1.BadRequestException('role with this name already exists');
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
    async deleteBoardRole(boardId, roleId, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const existing = await this.prisma.boardRole.findFirst({
            where: { id: roleId, boardId },
        });
        if (!existing) {
            throw new common_1.BadRequestException('role not found');
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
    async listBoardRoles(boardId, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const roles = await this.prisma.boardRole.findMany({
            where: { boardId },
            orderBy: { createdAt: 'asc' },
        });
        return roles;
    }
    async createBoardInvitation(boardId, dto, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const { customRoleId, customRoleName } = await this.resolveInvitationCustomRole(boardId, dto.customRoleId);
        const expiresAt = this.getInvitationExpiryDate();
        const token = this.generateInvitationToken();
        if (dto.type === client_1.InvitationType.PERSONAL) {
            const email = dto.email?.trim().toLowerCase();
            if (!email) {
                throw new common_1.BadRequestException('email is required for personal invitation');
            }
            const existingInvitation = await this.prisma.boardInvitation.findFirst({
                where: {
                    boardId,
                    type: client_1.InvitationType.PERSONAL,
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
                        type: client_1.InvitationType.PERSONAL,
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
        const sharedInvitationMode = dto.sharedInvitationMode ?? create_board_invitation_dto_1.SharedInvitationMode.SINGLE_USE;
        const maxUses = sharedInvitationMode === create_board_invitation_dto_1.SharedInvitationMode.MULTI_USE
            ? this.getSharedInvitationMaxUses()
            : 1;
        const invitation = await this.prisma.boardInvitation.create({
            data: {
                token,
                type: client_1.InvitationType.SHARED,
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
    async listBoardInvitations(boardId, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const invitations = await this.prisma.boardInvitation.findMany({
            where: { boardId },
            orderBy: { createdAt: 'desc' },
        });
        return invitations.map((invitation) => this.mapInvitation(invitation));
    }
    async acceptBoardInvitation(boardId, invitationId, userId) {
        const invitation = await this.prisma.boardInvitation.findFirst({
            where: { id: invitationId, boardId },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('invitation not found');
        }
        const accepted = await this.acceptInvitationRecord(invitation, userId);
        await this.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Инвайт принят',
            message: 'Новый участник присоединился к борде по приглашению',
        });
        return accepted;
    }
    async revokeBoardInvitation(boardId, invitationId, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const existing = await this.prisma.boardInvitation.findFirst({
            where: { id: invitationId, boardId },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.BadRequestException('invitation not found');
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
    async getInvitationByToken(token) {
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
            throw new common_1.NotFoundException('invitation not found');
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
    async acceptInvitationByToken(token, userId) {
        const invitation = await this.prisma.boardInvitation.findUnique({
            where: { token },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('invitation not found');
        }
        return this.acceptInvitationRecord(invitation, userId);
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_gateway_1.RealtimeGateway])
], BoardsService);
//# sourceMappingURL=boards.service.js.map