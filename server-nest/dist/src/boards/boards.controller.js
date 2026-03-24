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
const swagger_1 = require("@nestjs/swagger");
const boards_service_1 = require("./boards.service");
const create_board_dto_1 = require("./dto/create-board.dto");
const create_column_dto_1 = require("./dto/create-column.dto");
const reorder_columns_dto_1 = require("./dto/reorder-columns.dto");
const rename_column_dto_1 = require("./dto/rename-column.dto");
const delete_column_dto_1 = require("./dto/delete-column.dto");
const create_ticket_dto_1 = require("./dto/create-ticket.dto");
const create_ticket_comment_dto_1 = require("./dto/create-ticket-comment.dto");
const update_ticket_dto_1 = require("./dto/update-ticket.dto");
const reorder_tickets_dto_1 = require("./dto/reorder-tickets.dto");
const create_board_role_dto_1 = require("./dto/create-board-role.dto");
const update_board_role_dto_1 = require("./dto/update-board-role.dto");
const create_board_invitation_dto_1 = require("./dto/create-board-invitation.dto");
const update_board_member_custom_role_dto_1 = require("./dto/update-board-member-custom-role.dto");
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
    async findById(id, ticketsOffset, ticketsLimit, req) {
        const offset = Number.parseInt(ticketsOffset ?? '0', 10);
        const limit = Number.parseInt(ticketsLimit ?? '100', 10);
        const board = await this.boardsService.findById(id, req.serviceUser?.sub, {
            ticketsOffset: Number.isFinite(offset) ? offset : 0,
            ticketsLimit: Number.isFinite(limit) ? limit : 100,
        });
        if (!board)
            throw new common_1.NotFoundException();
        return board;
    }
    async deleteBoard(boardId, req) {
        await this.boardsService.deleteBoard(boardId, req.serviceUser?.sub);
        return { ok: true };
    }
    createColumn(boardId, dto, req) {
        return this.boardsService.createColumn(boardId, dto, req.serviceUser?.sub);
    }
    async reorderColumns(boardId, dto, req) {
        await this.boardsService.reorderColumns(boardId, dto, req.serviceUser?.sub);
        return { ok: true };
    }
    async renameColumn(boardId, columnId, dto, req) {
        await this.boardsService.renameColumn(boardId, columnId, dto, req.serviceUser?.sub);
        return { ok: true };
    }
    async deleteColumn(boardId, columnId, dto, req) {
        await this.boardsService.deleteColumn(boardId, columnId, dto, req.serviceUser?.sub);
        return { ok: true };
    }
    createTicket(boardId, dto, req) {
        return this.boardsService.createTicket(boardId, dto, req.serviceUser?.sub);
    }
    async reorderTickets(boardId, dto, req) {
        await this.boardsService.reorderTickets(boardId, dto, req.serviceUser?.sub);
        return { ok: true };
    }
    getTicketById(boardId, ticketId, req) {
        return this.boardsService.getTicketById(boardId, ticketId, req.serviceUser?.sub);
    }
    updateTicket(boardId, ticketId, dto, req) {
        return this.boardsService.updateTicket(boardId, ticketId, dto, req.serviceUser?.sub);
    }
    createTicketComment(boardId, ticketId, dto, req) {
        return this.boardsService.createTicketComment(boardId, ticketId, dto, req.serviceUser?.sub);
    }
    async deleteTicket(boardId, ticketId, req) {
        await this.boardsService.deleteTicket(boardId, ticketId, req.serviceUser?.sub);
        return { ok: true };
    }
    listBoardMembers(boardId, req) {
        return this.boardsService.listBoardMembers(boardId, req.serviceUser?.sub);
    }
    updateBoardMemberCustomRole(boardId, memberId, dto, req) {
        return this.boardsService.updateBoardMemberCustomRole(boardId, memberId, dto, req.serviceUser?.sub);
    }
    async leaveBoard(boardId, req) {
        await this.boardsService.leaveBoard(boardId, req.serviceUser?.sub);
        return { ok: true };
    }
    async removeBoardMember(boardId, memberId, req) {
        await this.boardsService.removeBoardMember(boardId, memberId, req.serviceUser?.sub);
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
    async deleteBoardRole(boardId, roleId, req) {
        await this.boardsService.deleteBoardRole(boardId, roleId, req.serviceUser?.sub);
        return { ok: true };
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
    async revokeBoardInvitation(boardId, invitationId, req) {
        await this.boardsService.revokeBoardInvitation(boardId, invitationId, req.serviceUser?.sub);
        return { ok: true };
    }
};
exports.BoardsController = BoardsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List boards available to current user' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Boards list' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new board' }),
    (0, swagger_1.ApiBody)({ type: create_board_dto_1.CreateBoardDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Board created' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_board_dto_1.CreateBoardDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get board by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Board ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Board details' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Board not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('ticketsOffset')),
    __param(2, (0, common_1.Query)('ticketsLimit')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "findById", null);
__decorate([
    (0, common_1.Delete)(':boardId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete board' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Board deleted',
        schema: { example: { ok: true } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "deleteBoard", null);
__decorate([
    (0, common_1.Post)(':boardId/columns'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create board column' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiBody)({ type: create_column_dto_1.CreateColumnDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Column created' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_column_dto_1.CreateColumnDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "createColumn", null);
__decorate([
    (0, common_1.Patch)(':boardId/columns/order'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder board columns' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiBody)({ type: reorder_columns_dto_1.ReorderColumnsDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Columns reordered',
        schema: { example: { ok: true } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reorder_columns_dto_1.ReorderColumnsDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "reorderColumns", null);
__decorate([
    (0, common_1.Patch)(':boardId/columns/:columnId'),
    (0, swagger_1.ApiOperation)({ summary: 'Rename board column' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'columnId', description: 'Column ID' }),
    (0, swagger_1.ApiBody)({ type: rename_column_dto_1.RenameColumnDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Column renamed',
        schema: { example: { ok: true } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('columnId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, rename_column_dto_1.RenameColumnDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "renameColumn", null);
__decorate([
    (0, common_1.Delete)(':boardId/columns/:columnId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete board column' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'columnId', description: 'Column ID' }),
    (0, swagger_1.ApiBody)({ type: delete_column_dto_1.DeleteColumnDto, required: false }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Column deleted',
        schema: { example: { ok: true } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('columnId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, delete_column_dto_1.DeleteColumnDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "deleteColumn", null);
__decorate([
    (0, common_1.Post)(':boardId/tickets'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create ticket in board' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiBody)({ type: create_ticket_dto_1.CreateTicketDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Ticket created' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_ticket_dto_1.CreateTicketDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "createTicket", null);
__decorate([
    (0, common_1.Patch)(':boardId/tickets/reorder'),
    (0, swagger_1.ApiOperation)({ summary: 'Reorder board tickets' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiBody)({ type: reorder_tickets_dto_1.ReorderTicketsDto }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Tickets reordered',
        schema: { example: { ok: true } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reorder_tickets_dto_1.ReorderTicketsDto, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "reorderTickets", null);
__decorate([
    (0, common_1.Get)(':boardId/tickets/:ticketId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get ticket by ID' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'ticketId', description: 'Ticket ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Ticket details' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Ticket not found' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('ticketId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "getTicketById", null);
__decorate([
    (0, common_1.Patch)(':boardId/tickets/:ticketId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update ticket' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'ticketId', description: 'Ticket ID' }),
    (0, swagger_1.ApiBody)({ type: update_ticket_dto_1.UpdateTicketDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Ticket updated' }),
    (0, swagger_1.ApiNotFoundResponse)({ description: 'Ticket not found' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('ticketId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_ticket_dto_1.UpdateTicketDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "updateTicket", null);
__decorate([
    (0, common_1.Post)(':boardId/tickets/:ticketId/comments'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create ticket comment' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'ticketId', description: 'Ticket ID' }),
    (0, swagger_1.ApiBody)({ type: create_ticket_comment_dto_1.CreateTicketCommentDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Comment created' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('ticketId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_ticket_comment_dto_1.CreateTicketCommentDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "createTicketComment", null);
__decorate([
    (0, common_1.Delete)(':boardId/tickets/:ticketId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete ticket' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'ticketId', description: 'Ticket ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Ticket deleted',
        schema: { example: { ok: true } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('ticketId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "deleteTicket", null);
__decorate([
    (0, common_1.Get)(':boardId/members'),
    (0, swagger_1.ApiOperation)({ summary: 'List board members' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Board members list' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "listBoardMembers", null);
__decorate([
    (0, common_1.Patch)(':boardId/members/:memberId/custom-role'),
    (0, swagger_1.ApiOperation)({ summary: 'Update member custom role in board' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', description: 'Board member ID' }),
    (0, swagger_1.ApiBody)({ type: update_board_member_custom_role_dto_1.UpdateBoardMemberCustomRoleDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Member custom role updated' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_board_member_custom_role_dto_1.UpdateBoardMemberCustomRoleDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "updateBoardMemberCustomRole", null);
__decorate([
    (0, common_1.Delete)(':boardId/members/me'),
    (0, swagger_1.ApiOperation)({ summary: 'Leave board as current user' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Left board successfully',
        schema: { example: { ok: true } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "leaveBoard", null);
__decorate([
    (0, common_1.Delete)(':boardId/members/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove board member' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'memberId', description: 'Board member ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Member removed',
        schema: { example: { ok: true } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('memberId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "removeBoardMember", null);
__decorate([
    (0, common_1.Post)(':boardId/roles'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create custom role for board' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiBody)({ type: create_board_role_dto_1.CreateBoardRoleDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Role created' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_board_role_dto_1.CreateBoardRoleDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "createBoardRole", null);
__decorate([
    (0, common_1.Get)(':boardId/roles'),
    (0, swagger_1.ApiOperation)({ summary: 'List board custom roles' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Board roles list' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "listBoardRoles", null);
__decorate([
    (0, common_1.Patch)(':boardId/roles/:roleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update board custom role' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'roleId', description: 'Role ID' }),
    (0, swagger_1.ApiBody)({ type: update_board_role_dto_1.UpdateBoardRoleDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'Role updated' }),
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
    (0, swagger_1.ApiOperation)({ summary: 'Delete board custom role' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'roleId', description: 'Role ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Role deleted',
        schema: { example: { ok: true } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "deleteBoardRole", null);
__decorate([
    (0, common_1.Post)(':boardId/invitations'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({ summary: 'Create board invitation' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiBody)({ type: create_board_invitation_dto_1.CreateBoardInvitationDto }),
    (0, swagger_1.ApiCreatedResponse)({ description: 'Invitation created' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_board_invitation_dto_1.CreateBoardInvitationDto, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "createBoardInvitation", null);
__decorate([
    (0, common_1.Get)(':boardId/invitations'),
    (0, swagger_1.ApiOperation)({ summary: 'List board invitations' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiOkResponse)({ description: 'Invitations list' }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "listBoardInvitations", null);
__decorate([
    (0, common_1.Post)(':boardId/invitations/:invitationId/accept'),
    (0, swagger_1.ApiOperation)({ summary: 'Accept board invitation by invitation ID' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'invitationId', description: 'Invitation ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Invitation accepted',
        schema: { example: { success: true, boardId: 'board_1' } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('invitationId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BoardsController.prototype, "acceptBoardInvitation", null);
__decorate([
    (0, common_1.Delete)(':boardId/invitations/:invitationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Revoke board invitation' }),
    (0, swagger_1.ApiParam)({ name: 'boardId', description: 'Board ID' }),
    (0, swagger_1.ApiParam)({ name: 'invitationId', description: 'Invitation ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Invitation revoked',
        schema: { example: { ok: true } },
    }),
    __param(0, (0, common_1.Param)('boardId')),
    __param(1, (0, common_1.Param)('invitationId')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BoardsController.prototype, "revokeBoardInvitation", null);
exports.BoardsController = BoardsController = __decorate([
    (0, swagger_1.ApiTags)('Boards'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    (0, swagger_1.ApiForbiddenResponse)({ description: 'Forbidden' }),
    (0, common_1.Controller)('boards'),
    (0, common_1.UseGuards)(internal_auth_guard_1.InternalAuthGuard),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], BoardsController);
//# sourceMappingURL=boards.controller.js.map