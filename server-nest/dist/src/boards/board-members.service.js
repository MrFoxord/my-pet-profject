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
exports.BoardMembersService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const board_notifications_service_1 = require("./board-notifications.service");
const boards_access_service_1 = require("./boards-access.service");
let BoardMembersService = class BoardMembersService {
    constructor(prisma, boardsAccessService, boardNotificationsService) {
        this.prisma = prisma;
        this.boardsAccessService = boardsAccessService;
        this.boardNotificationsService = boardNotificationsService;
    }
    async listBoardMembers(boardId, userId) {
        await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        const members = await this.prisma.boardMember.findMany({
            where: { boardId },
            orderBy: { createdAt: 'asc' },
            select: {
                id: true,
                boardId: true,
                userId: true,
                role: true,
                customRoleId: true,
                customRole: { select: { name: true, permissions: true } },
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
            customRolePermissions: member.customRole?.permissions ?? [],
            email: member.user.email ?? null,
            name: member.user.name ?? null,
            nickname: member.user.nickname ?? null,
        }));
    }
    async updateBoardMemberCustomRole(boardId, memberId, dto, userId) {
        const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        if (!this.boardsAccessService.canManageTicketAccess(membership)) {
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
                customRole: { select: { name: true, permissions: true } },
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
            customRolePermissions: updated.customRole?.permissions ?? [],
            email: updated.user.email ?? null,
            name: updated.user.name ?? null,
            nickname: updated.user.nickname ?? null,
        };
        await this.boardNotificationsService.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Роль участника изменена',
            message: `Обновлена роль участника: ${result.name ?? result.nickname ?? result.email ?? result.userId}`,
        });
        return result;
    }
    async leaveBoard(boardId, userId) {
        const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        if (membership.role === client_1.BoardMemberRole.OWNER) {
            throw new common_1.BadRequestException('board owner cannot leave board');
        }
        await this.prisma.boardMember.delete({
            where: { boardId_userId: { boardId, userId: userId } },
        });
        await this.boardNotificationsService.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Участник покинул борду',
            message: 'Один из участников покинул борду',
        });
    }
    async removeBoardMember(boardId, memberId, userId) {
        const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        if (!this.boardsAccessService.canManageTicketAccess(membership)) {
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
        await this.boardNotificationsService.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Участник удален',
            message: 'Один из участников был удален из борды',
        });
        await this.boardNotificationsService.createAndDispatchNotifications([member.userId], {
            kind: 'board',
            boardId,
            title: 'Доступ к борде отозван',
            message: 'Ваш доступ к борде был удален',
        });
    }
};
exports.BoardMembersService = BoardMembersService;
exports.BoardMembersService = BoardMembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        boards_access_service_1.BoardsAccessService,
        board_notifications_service_1.BoardNotificationsService])
], BoardMembersService);
//# sourceMappingURL=board-members.service.js.map