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
exports.BoardRolesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const board_notifications_service_1 = require("./board-notifications.service");
const boards_access_service_1 = require("./boards-access.service");
const boards_types_1 = require("./boards.types");
let BoardRolesService = class BoardRolesService {
    constructor(prisma, boardsAccessService, boardNotificationsService) {
        this.prisma = prisma;
        this.boardsAccessService = boardsAccessService;
        this.boardNotificationsService = boardNotificationsService;
    }
    async ensureCanManageRoles(boardId, userId) {
        const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        if (!this.boardsAccessService.canManageTicketAccess(membership)) {
            throw new common_1.BadRequestException('only OWNER or ADMIN can manage board roles');
        }
    }
    async createBoardRole(boardId, dto, userId) {
        await this.ensureCanManageRoles(boardId, userId);
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
        const permissions = dto.permissions === undefined
            ? [...boards_types_1.ALL_TICKET_PERMISSIONS]
            : this.boardsAccessService.normalizeRolePermissions(dto.permissions);
        if (dto.permissions !== undefined && permissions.length === 0) {
            throw new common_1.BadRequestException('role must include at least one valid permission');
        }
        const role = await this.prisma.boardRole.create({
            data: {
                boardId,
                name,
                permissions,
            },
        });
        await this.boardNotificationsService.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Создана новая роль',
            message: `Добавлена роль: ${role.name}`,
        });
        return role;
    }
    async updateBoardRole(boardId, roleId, dto, userId) {
        await this.ensureCanManageRoles(boardId, userId);
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
            const permissions = this.boardsAccessService.normalizeRolePermissions(dto.permissions);
            if (permissions.length === 0) {
                throw new common_1.BadRequestException('role must include at least one valid permission');
            }
            updateData.permissions = permissions;
        }
        const role = await this.prisma.boardRole.update({
            where: { id: roleId },
            data: updateData,
        });
        await this.boardNotificationsService.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Роль обновлена',
            message: `Обновлена роль: ${role.name}`,
        });
        return role;
    }
    async deleteBoardRole(boardId, roleId, userId) {
        await this.ensureCanManageRoles(boardId, userId);
        const existing = await this.prisma.boardRole.findFirst({
            where: { id: roleId, boardId },
        });
        if (!existing) {
            throw new common_1.BadRequestException('role not found');
        }
        await this.prisma.boardRole.delete({
            where: { id: roleId },
        });
        await this.boardNotificationsService.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Роль удалена',
            message: `Удалена роль: ${existing.name}`,
        });
    }
    async listBoardRoles(boardId, userId) {
        await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        return this.prisma.boardRole.findMany({
            where: { boardId },
            orderBy: { createdAt: 'asc' },
        });
    }
};
exports.BoardRolesService = BoardRolesService;
exports.BoardRolesService = BoardRolesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        boards_access_service_1.BoardsAccessService,
        board_notifications_service_1.BoardNotificationsService])
], BoardRolesService);
//# sourceMappingURL=board-roles.service.js.map