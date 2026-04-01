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
exports.BoardStructureService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
const realtime_gateway_1 = require("../realtime/realtime.gateway");
const boards_access_service_1 = require("./boards-access.service");
const board_notifications_service_1 = require("./board-notifications.service");
let BoardStructureService = class BoardStructureService {
    constructor(prisma, realtimeGateway, boardsAccessService, boardNotificationsService) {
        this.prisma = prisma;
        this.realtimeGateway = realtimeGateway;
        this.boardsAccessService = boardsAccessService;
        this.boardNotificationsService = boardNotificationsService;
    }
    async reorderColumns(boardId, dto, userId) {
        await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        const { columnIds } = dto;
        if (!columnIds?.length) {
            throw new common_1.BadRequestException('columnIds are required');
        }
        const existing = await this.prisma.boardColumn.findMany({
            where: { boardId },
            select: { id: true },
        });
        if (existing.length !== columnIds.length) {
            throw new common_1.BadRequestException('columnIds count mismatch');
        }
        const existingSet = new Set(existing.map((column) => column.id));
        for (const id of columnIds) {
            if (!existingSet.has(id)) {
                throw new common_1.BadRequestException('unknown column id');
            }
        }
        await this.prisma.$transaction(columnIds.map((id, idx) => this.prisma.boardColumn.update({
            where: { id },
            data: { position: idx, updatedAt: new Date() },
        })));
        await this.boardNotificationsService.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Колонки перемещены',
            message: 'Порядок колонок в борде был изменен',
        });
        this.emitBoardStateChanged(boardId, 'columns_changed', userId);
    }
    async createColumn(boardId, dto, userId) {
        await this.boardsAccessService.ensureBoardMembership(boardId, userId);
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
        await this.boardNotificationsService.notifyBoardMembers(boardId, {
            actorUserId: userId,
            title: 'Колонка добавлена',
            message: `Добавлена новая колонка: ${created.title}`,
        });
        this.emitBoardStateChanged(boardId, 'columns_changed', userId);
        return created;
    }
    async renameColumn(boardId, columnId, dto, userId) {
        await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        const title = dto.title?.trim();
        if (!title) {
            throw new common_1.BadRequestException('title is required');
        }
        const column = await this.prisma.boardColumn.findFirst({
            where: { id: columnId, boardId },
        });
        if (!column) {
            throw new common_1.BadRequestException('column not found');
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
    async deleteColumn(boardId, columnId, dto, userId) {
        await this.boardsAccessService.ensureBoardMembership(boardId, userId);
        const count = await this.prisma.boardColumn.count({ where: { boardId } });
        if (count <= 1) {
            throw new common_1.BadRequestException('at least one column must remain');
        }
        const column = await this.prisma.boardColumn.findFirst({
            where: { id: columnId, boardId },
        });
        if (!column) {
            throw new common_1.BadRequestException('column not found');
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
    emitBoardStateChanged(boardId, reason, actorUserId) {
        this.realtimeGateway.emitBoardStateChanged({
            boardId,
            reason,
            actorUserId,
        });
    }
};
exports.BoardStructureService = BoardStructureService;
exports.BoardStructureService = BoardStructureService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_gateway_1.RealtimeGateway,
        boards_access_service_1.BoardsAccessService,
        board_notifications_service_1.BoardNotificationsService])
], BoardStructureService);
//# sourceMappingURL=board-structure.service.js.map