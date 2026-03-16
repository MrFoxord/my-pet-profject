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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardsController = void 0;
const common_1 = require("@nestjs/common");
const boards_service_1 = require("./boards.service");
const create_board_dto_1 = require("./dto/create-board.dto");
const reorder_columns_dto_1 = require("./dto/reorder-columns.dto");
const rename_column_dto_1 = require("./dto/rename-column.dto");
const delete_column_dto_1 = require("./dto/delete-column.dto");
let BoardsController = class BoardsController {
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    findAll(userId) {
        return this.boardsService.findAll(userId);
    }
    create(dto) {
        return this.boardsService.create(dto);
    }
    async findById(id, userId) {
        const board = await this.boardsService.findById(id, userId);
        if (!board)
            throw new common_1.NotFoundException();
        return board;
    }
    async reorderColumns(boardId, dto) {
        await this.boardsService.reorderColumns(boardId, dto);
        return { ok: true };
    }
    async renameColumn(boardId, columnId, dto) {
        await this.boardsService.renameColumn(boardId, columnId, dto);
        return { ok: true };
    }
    async deleteColumn(boardId, columnId, dto) {
        await this.boardsService.deleteColumn(boardId, columnId, dto);
        return { ok: true };
    }
};
exports.BoardsController = BoardsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_board_dto_1.CreateBoardDto]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':boardId/columns/order'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reorder_columns_dto_1.ReorderColumnsDto]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "reorderColumns", null);
__decorate([
    (0, common_1.Patch)(':boardId/columns/:columnId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('columnId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, rename_column_dto_1.RenameColumnDto]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "renameColumn", null);
__decorate([
    (0, common_1.Delete)(':boardId/columns/:columnId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('columnId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, delete_column_dto_1.DeleteColumnDto]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "deleteColumn", null);
exports.BoardsController = BoardsController = __decorate([
    (0, common_1.Controller)('boards'),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsController);
//# sourceMappingURL=boards.controller.js.map