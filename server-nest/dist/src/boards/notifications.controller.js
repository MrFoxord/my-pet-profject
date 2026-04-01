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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const internal_auth_guard_1 = require("../auth/internal-auth.guard");
const board_notifications_service_1 = require("./board-notifications.service");
let NotificationsController = class NotificationsController {
    constructor(boardNotificationsService) {
        this.boardNotificationsService = boardNotificationsService;
    }
    list(req) {
        return this.boardNotificationsService.listUserNotifications(req.serviceUser?.sub);
    }
    markAllAsRead(req) {
        return this.boardNotificationsService.markAllNotificationsRead(req.serviceUser?.sub);
    }
    markAsRead(notificationId, req) {
        return this.boardNotificationsService.markNotificationRead(notificationId, req.serviceUser?.sub);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List user notifications' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Notifications list with unread count',
        schema: {
            example: {
                unreadCount: 2,
                items: [
                    {
                        id: 'notif_1',
                        kind: 'ticket',
                        boardId: 'board_1',
                        ticketId: 'ticket_1',
                        title: 'Ticket updated',
                        message: 'Priority changed to high',
                        isRead: false,
                        createdAt: '2026-03-24T12:00:00.000Z',
                    },
                ],
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)('read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all user notifications as read' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Read status updated',
        schema: { example: { ok: true, unreadCount: 0 } },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Patch)(':notificationId/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark one notification as read' }),
    (0, swagger_1.ApiParam)({ name: 'notificationId', description: 'Notification ID' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Read status updated',
        schema: { example: { ok: true, unreadCount: 1 } },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Unauthorized' }),
    __param(0, (0, common_1.Param)('notificationId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, swagger_1.ApiBearerAuth)('bearer'),
    (0, common_1.Controller)('notifications'),
    (0, common_1.UseGuards)(internal_auth_guard_1.InternalAuthGuard),
    __metadata("design:paramtypes", [board_notifications_service_1.BoardNotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map