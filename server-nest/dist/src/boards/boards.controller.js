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
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const update_ticket_dto_1 = require("./dto/update-ticket.dto");
const reorder_tickets_dto_1 = require("./dto/reorder-tickets.dto");
const create_board_role_dto_1 = require("./dto/create-board-role.dto");
const update_board_role_dto_1 = require("./dto/update-board-role.dto");
const create_board_invitation_dto_1 = require("./dto/create-board-invitation.dto");
const internal_auth_guard_1 = require("../auth/internal-auth.guard");
let BoardsController = class BoardsController {
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    findAll(req) {
        return this.boardsService.findAll(req.serviceUser?.sub);
    }
    create(dto, req) {
        return this.boardsService.create({ ...dto, ownerId: req.serviceUser?.sub });
    }
    async findById(id, req) {
        const board = await this.boardsService.findById(id, req.serviceUser?.sub);
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
    createTicket(boardId, dto, req) {
        return this.boardsService.createTicket(boardId, dto, req.serviceUser?.sub);
    }
    async reorderTickets(boardId, dto, req) {
        await this.boardsService.reorderTickets(boardId, dto, req.serviceUser?.sub);
        return { ok: true };
    }
    updateTicket(boardId, ticketId, dto, req) {
        return this.boardsService.updateTicket(boardId, ticketId, dto, req.serviceUser?.sub);
    }
    async deleteTicket(boardId, ticketId, req) {
        await this.boardsService.deleteTicket(boardId, ticketId, req.serviceUser?.sub);
        return { ok: true };
    }
    createBoardRole(boardId, dto, req) {
        return this.boardsService.createBoardRole(boardId, dto, req.serviceUser?.sub);
    }
    listBoardRoles(boardId, req) {
        return this.boardsService.listBoardRoles(boardId, req.serviceUser?.sub);
    }
    updateBoardRole(boardId, roleId, dto, req) {
        return this.boardsService.updateBoardRole(boardId, roleId, dto, req.serviceUser?.sub);
    }
    deleteBoardRole(boardId, roleId, req) {
        return this.boardsService.deleteBoardRole(boardId, roleId, req.serviceUser?.sub);
    }
    createBoardInvitation(boardId, dto, req) {
        return this.boardsService.createBoardInvitation(boardId, dto, req.serviceUser?.sub);
    }
    listBoardInvitations(boardId, req) {
        return this.boardsService.listBoardInvitations(boardId, req.serviceUser?.sub);
    }
    acceptBoardInvitation(boardId, invitationId, req) {
        return this.boardsService.acceptBoardInvitation(boardId, invitationId, req.serviceUser?.sub);
    }
    revokeBoardInvitation(boardId, invitationId, req) {
        return this.boardsService.revokeBoardInvitation(boardId, invitationId, req.serviceUser?.sub);
    }
};
exports.BoardsController = BoardsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_board_dto_1.CreateBoardDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
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
__decorate([
    (0, common_1.Post)(':boardId/tickets'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_ticket_dto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Patch)(':boardId/tickets/reorder'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reorder_tickets_dto_1.ReorderTicketsDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "reorderTickets", null);
__decorate([
    (0, common_1.Patch)(':boardId/tickets/:ticketId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('ticketId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_ticket_dto_1.UpdateTicketDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "updateTicket", null);
__decorate([
    (0, common_1.Delete)(':boardId/tickets/:ticketId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('ticketId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "deleteTicket", null);
__decorate([
    (0, common_1.Post)(':boardId/roles'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_board_role_dto_1.CreateBoardRoleDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "createBoardRole", null);
__decorate([
    (0, common_1.Get)(':boardId/roles'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "listBoardRoles", null);
__decorate([
    (0, common_1.Patch)(':boardId/roles/:roleId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_board_role_dto_1.UpdateBoardRoleDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "updateBoardRole", null);
__decorate([
    (0, common_1.Delete)(':boardId/roles/:roleId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "deleteBoardRole", null);
__decorate([
    (0, common_1.Post)(':boardId/invitations'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_board_invitation_dto_1.CreateBoardInvitationDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "createBoardInvitation", null);
__decorate([
    (0, common_1.Get)(':boardId/invitations'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "listBoardInvitations", null);
__decorate([
    (0, common_1.Post)(':boardId/invitations/:invitationId/accept'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('invitationId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "acceptBoardInvitation", null);
__decorate([
    (0, common_1.Delete)(':boardId/invitations/:invitationId'),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('invitationId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "revokeBoardInvitation", null);
exports.BoardsController = BoardsController = __decorate([
    (0, common_1.Controller)('boards'),
    (0, common_1.UseGuards)(internal_auth_guard_1.InternalAuthGuard),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsController);
//# sourceMappingURL=boards.controller.js.map