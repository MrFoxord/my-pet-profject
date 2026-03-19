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
const DEFAULT_THEME_COLOR = '#f3f4f6';
const DEFAULT_ASSIGNEE = {
    name: 'Unassigned',
    avatar: 'https://i.pravatar.cc/100?img=1',
};
let BoardsService = class BoardsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.standardTicketAccessRoles = new Set(['owner', 'admin', 'member', 'viewer']);
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
    async findById(boardId, userId) {
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
                        subtasks: {
                            orderBy: { id: 'asc' },
                            select: { id: true, title: true, done: true },
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
            columns: board.columns,
            tickets: visibleTickets.map((t) => ({
                id: t.id,
                title: t.title,
                description: t.description ?? '',
                type: t.type,
                priority: t.priority,
                status: t.status,
                sortIndex: t.sortIndex,
                columnId: t.columnId,
                accessPolicy: t.accessPolicy,
                createdAt: t.createdAt.toISOString(),
                updatedAt: t.updatedAt.toISOString(),
                dueDate: t.dueDate?.toISOString() ?? '',
                assignee: DEFAULT_ASSIGNEE,
                subtasks: t.subtasks,
            })),
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
    async reorderColumns(boardId, dto) {
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
    }
    async renameColumn(boardId, columnId, dto) {
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
    }
    async deleteColumn(boardId, columnId, dto) {
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
        const accessPolicy = dto.accessPolicy ?? {};
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
            if (!this.canAccessTicket(ticket.accessPolicy, membership)) {
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
    }
    async updateTicket(boardId, ticketId, dto, userId) {
        const membership = await this.ensureBoardMembership(boardId, userId);
        const existing = await this.prisma.ticket.findFirst({
            where: { id: ticketId, boardId },
            select: { id: true, status: true, columnId: true, sortIndex: true, accessPolicy: true },
        });
        if (!existing) {
            throw new common_1.BadRequestException('ticket not found');
        }
        if (!this.canAccessTicket(existing.accessPolicy, membership)) {
            throw new common_1.BadRequestException('ticket access denied');
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
            ? dto.accessPolicy
            : undefined;
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
    async deleteTicket(boardId, ticketId, userId) {
        const membership = await this.ensureBoardMembership(boardId, userId);
        const existing = await this.prisma.ticket.findFirst({
            where: { id: ticketId, boardId },
            select: { id: true, accessPolicy: true },
        });
        if (!existing) {
            throw new common_1.BadRequestException('ticket not found');
        }
        if (!this.canAccessTicket(existing.accessPolicy, membership)) {
            throw new common_1.BadRequestException('ticket access denied');
        }
        await this.prisma.ticket.delete({ where: { id: ticketId } });
    }
    generateBoardId() {
        const randomHex = crypto.randomBytes(4).toString('hex');
        return `board-${Date.now()}-${randomHex}`;
    }
    generateInvitationToken() {
        const randomHex = crypto.randomBytes(12).toString('hex');
        return `inv_${randomHex}`;
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
        if (!membership.role) {
            return false;
        }
        if (this.canManageTicketAccess(membership)) {
            return true;
        }
        const viewRoles = accessPolicy?.view ?? [];
        if (!viewRoles.length) {
            return true;
        }
        const effectiveRoles = this.getEffectiveTicketRoles(membership);
        return viewRoles.some((role) => effectiveRoles.has(role));
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
        return {
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
        const email = dto.email.trim().toLowerCase();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const token = this.generateInvitationToken();
        const invitation = await this.prisma.boardInvitation.upsert({
            where: { boardId_email: { boardId, email } },
            create: {
                boardId,
                email,
                role: dto.role,
                status: 'pending',
                expiresAt,
                token,
            },
            update: {
                role: dto.role,
                status: 'pending',
                expiresAt,
                token,
            },
        });
        return {
            id: invitation.id,
            email: invitation.email,
            role: invitation.role,
            status: invitation.status,
            expiresAt: invitation.expiresAt,
            token: invitation.token,
            shareUrl: `/invite/${invitation.token}`,
        };
    }
    async listBoardInvitations(boardId, userId) {
        await this.ensureBoardMembership(boardId, userId);
        return this.prisma.boardInvitation.findMany({
            where: { boardId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async acceptBoardInvitation(boardId, invitationId, userId) {
        if (!userId) {
            throw new common_1.BadRequestException('user is required');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user?.email) {
            throw new common_1.BadRequestException('user email is required to accept invitation');
        }
        const invitation = await this.prisma.boardInvitation.findFirst({
            where: { id: invitationId, boardId },
        });
        if (!invitation) {
            throw new common_1.BadRequestException('invitation not found');
        }
        if (invitation.status !== 'pending') {
            throw new common_1.BadRequestException('invitation is not pending');
        }
        if (invitation.expiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('invitation is expired');
        }
        if (invitation.email !== user.email.toLowerCase()) {
            throw new common_1.BadRequestException('invitation email mismatch');
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
    async revokeBoardInvitation(boardId, invitationId, userId) {
        await this.ensureBoardMembership(boardId, userId);
        const existing = await this.prisma.boardInvitation.findFirst({
            where: { id: invitationId, boardId },
            select: { id: true },
        });
        if (!existing) {
            throw new common_1.BadRequestException('invitation not found');
        }
        await this.prisma.boardInvitation.update({
            where: { id: invitationId },
            data: { status: 'declined' },
        });
    }
    async getInvitationByToken(token) {
        const invitation = await this.prisma.boardInvitation.findUnique({
            where: { token },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                expiresAt: true,
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
        if (invitation.status !== 'pending') {
            throw new common_1.BadRequestException('invitation is not pending');
        }
        if (invitation.expiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('invitation is expired');
        }
        return invitation;
    }
    async acceptInvitationByToken(token, userId) {
        if (!userId) {
            throw new common_1.BadRequestException('user is required to accept invitation');
        }
        const invitation = await this.prisma.boardInvitation.findUnique({
            where: { token },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('invitation not found');
        }
        if (invitation.status !== 'pending') {
            throw new common_1.BadRequestException('invitation is not pending');
        }
        if (invitation.expiresAt.getTime() < Date.now()) {
            throw new common_1.BadRequestException('invitation is expired');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });
        if (!user?.email) {
            throw new common_1.BadRequestException('user email is required');
        }
        if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
            throw new common_1.BadRequestException('invitation email mismatch');
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.boardMember.upsert({
                where: { boardId_userId: { boardId: invitation.boardId, userId } },
                create: {
                    boardId: invitation.boardId,
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
        return { success: true, boardId: invitation.boardId };
    }
};
exports.BoardsService = BoardsService;
exports.BoardsService = BoardsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoardsService);
//# sourceMappingURL=boards.service.js.map