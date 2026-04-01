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
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const boards_access_service_1 = require("./boards-access.service");
const board_notifications_service_1 = require("./board-notifications.service");
const board_structure_service_1 = require("./board-structure.service");
const board_tickets_service_1 = require("./board-tickets.service");
const boards_constants_1 = require("./boards.constants");
const boards_types_1 = require("./boards.types");
let BoardsService = class BoardsService {
    constructor(prisma, realtimeGateway, boardsAccessService, boardNotificationsService, boardStructureService, boardTicketsService) {
        this.prisma = prisma;
        this.realtimeGateway = realtimeGateway;
        this.boardsAccessService = boardsAccessService;
        this.boardNotificationsService = boardNotificationsService;
        this.boardStructureService = boardStructureService;
        this.boardTicketsService = boardTicketsService;
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
            const membership = board.memberships?.[0];
            const membershipRole = membership?.role ?? null;
            const customRoleName = membership?.customRole?.name ?? null;
            const customRolePermissions = this.boardsAccessService.normalizeRolePermissions(membership?.customRole?.permissions ?? []);
            const visibleTickets = board.tickets.filter((ticket) => this.boardsAccessService.canAccessTicket(ticket.accessPolicy, {
                role: membershipRole,
                customRoleName,
                customRolePermissions,
            }));
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
        const membership = board.memberships?.[0];
        const currentUserRole = membership?.role ?? null;
        const currentUserCustomRole = membership?.customRole?.name ?? null;
        const currentUserCustomRolePermissions = this.boardsAccessService.normalizeRolePermissions(membership?.customRole?.permissions ?? []);
        const visibleTickets = board.tickets.filter((ticket) => this.boardsAccessService.canAccessTicket(ticket.accessPolicy, {
            role: currentUserRole,
            customRoleName: currentUserCustomRole,
            customRolePermissions: currentUserCustomRolePermissions,
        }));
        return {
            id: board.id,
            title: board.title,
            description: board.description ?? '',
            logoUrl: board.logoUrl ?? null,
            themeColor: board.themeColor || boards_constants_1.DEFAULT_THEME_COLOR,
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
    async create(dto) {
        const title = dto.title?.trim();
        if (!title) {
            throw new common_1.BadRequestException('title is required');
        }
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
                        permissions: [...boards_types_1.ALL_TICKET_PERMISSIONS],
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
    async updateBoard(boardId, dto, userId) {
        const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        if (!this.boardsAccessService.canManageTicketAccess(membership)) {
            throw new common_1.BadRequestException('only OWNER or ADMIN can update board settings');
        }
        const existing = await this.prisma.board.findUnique({
            where: { id: boardId },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.NotFoundException('board not found');
        }
        const updateData = {};
        if (dto.title !== undefined) {
            const title = dto.title.trim();
            if (!title) {
                throw new common_1.BadRequestException('title cannot be empty');
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
    async deleteBoard(boardId, userId) {
        const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        if (membership.role !== client_1.BoardMemberRole.OWNER) {
            throw new common_1.BadRequestException('only board owner can delete board');
        }
        await this.prisma.board.delete({
            where: { id: boardId },
        });
    }
    async reorderColumns(boardId, dto, userId) {
        return this.boardStructureService.reorderColumns(boardId, dto, userId);
    }
    async createColumn(boardId, dto, userId) {
        return this.boardStructureService.createColumn(boardId, dto, userId);
    }
    async renameColumn(boardId, columnId, dto, userId) {
        return this.boardStructureService.renameColumn(boardId, columnId, dto, userId);
    }
    async deleteColumn(boardId, columnId, dto, userId) {
        return this.boardStructureService.deleteColumn(boardId, columnId, dto, userId);
    }
    async createTicket(boardId, dto, userId) {
        return this.boardTicketsService.createTicket(boardId, dto, userId);
    }
    async getTicketById(boardId, ticketId, userId) {
        return this.boardTicketsService.getTicketById(boardId, ticketId, userId);
    }
    async reorderTickets(boardId, dto, userId) {
        return this.boardTicketsService.reorderTickets(boardId, dto, userId);
    }
    async updateTicket(boardId, ticketId, dto, userId) {
        return this.boardTicketsService.updateTicket(boardId, ticketId, dto, userId);
    }
    async createTicketComment(boardId, ticketId, dto, userId) {
        return this.boardTicketsService.createTicketComment(boardId, ticketId, dto, userId);
    }
    async deleteTicket(boardId, ticketId, userId) {
        return this.boardTicketsService.deleteTicket(boardId, ticketId, userId);
    }
    generateBoardId() {
        const randomHex = crypto.randomBytes(4).toString('hex');
        return `board-${Date.now()}-${randomHex}`;
    }
    normalizeColumnTitles(columns) {
        const seen = new Set();
        const normalized = [];
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
    normalizeRoleTitles(roles) {
        const seen = new Set();
        const normalized = [];
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
    emitBoardStateChanged(boardId, reason, actorUserId) {
        this.realtimeGateway.emitBoardStateChanged({
            boardId,
            reason,
            actorUserId,
        });
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_gateway_1.RealtimeGateway,
        boards_access_service_1.BoardsAccessService,
        board_notifications_service_1.BoardNotificationsService,
        board_structure_service_1.BoardStructureService,
        board_tickets_service_1.BoardTicketsService])
], BoardsService);
//# sourceMappingURL=board-workflow.service.js.map