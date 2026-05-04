"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardsModule = void 0;
const common_1 = require("@nestjs/common");
const boards_controller_1 = require("./boards.controller");
const board_tickets_controller_1 = require("./board-tickets.controller");
const board_invitations_controller_1 = require("./board-invitations.controller");
const board_members_controller_1 = require("./board-members.controller");
const board_roles_controller_1 = require("./board-roles.controller");
const invitations_public_controller_1 = require("./invitations.public.controller");
const notifications_controller_1 = require("./notifications.controller");
const board_workflow_service_1 = require("./board-workflow.service");
const boards_access_service_1 = require("./boards-access.service");
const board_notifications_service_1 = require("./board-notifications.service");
const board_structure_service_1 = require("./board-structure.service");
const board_tickets_service_1 = require("./board-tickets.service");
const board_invitations_service_1 = require("./board-invitations.service");
const board_members_service_1 = require("./board-members.service");
const board_roles_service_1 = require("./board-roles.service");
const auth_module_1 = require("../auth/auth.module");
const realtime_module_1 = require("../realtime/realtime.module");
let BoardsModule = class BoardsModule {
};
exports.BoardsModule = BoardsModule;
exports.BoardsModule = BoardsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule, realtime_module_1.RealtimeModule],
        controllers: [
            boards_controller_1.BoardsController,
            board_tickets_controller_1.BoardTicketsController,
            board_invitations_controller_1.BoardInvitationsController,
            board_members_controller_1.BoardMembersController,
            board_roles_controller_1.BoardRolesController,
            invitations_public_controller_1.InvitationsPublicController,
            notifications_controller_1.NotificationsController,
        ],
        providers: [
            board_workflow_service_1.BoardsService,
            boards_access_service_1.BoardsAccessService,
            board_notifications_service_1.BoardNotificationsService,
            board_structure_service_1.BoardStructureService,
            board_tickets_service_1.BoardTicketsService,
            board_invitations_service_1.BoardInvitationsService,
            board_members_service_1.BoardMembersService,
            board_roles_service_1.BoardRolesService,
        ],
    })
], BoardsModule);
//# sourceMappingURL=boards.module.js.map