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
var RealtimeGateway_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
let RealtimeGateway = RealtimeGateway_1 = class RealtimeGateway {
    constructor() {
        this.logger = new common_1.Logger(RealtimeGateway_1.name);
        this.socketsByUserId = new Map();
        this.userIdBySocketId = new Map();
    }
    handleConnection(client) {
        this.logger.log(`[ws] client connected: ${client.id}`);
    }
    handleRegisterUser(client, payload) {
        const userId = payload?.userId?.trim();
        if (!userId) {
            return { ok: false };
        }
        const previousUserId = this.userIdBySocketId.get(client.id);
        if (previousUserId && previousUserId !== userId) {
            const previousSockets = this.socketsByUserId.get(previousUserId);
            previousSockets?.delete(client.id);
            if (!previousSockets || previousSockets.size === 0) {
                this.socketsByUserId.delete(previousUserId);
            }
        }
        this.userIdBySocketId.set(client.id, userId);
        const userSockets = this.socketsByUserId.get(userId) ?? new Set();
        userSockets.add(client.id);
        this.socketsByUserId.set(userId, userSockets);
        return { ok: true };
    }
    handleSubscribeBoard(client, payload) {
        const boardId = payload?.boardId?.trim();
        if (!boardId) {
            return { ok: false };
        }
        client.join(`board:${boardId}`);
        return { ok: true };
    }
    handleUnsubscribeBoard(client, payload) {
        const boardId = payload?.boardId?.trim();
        if (!boardId) {
            return { ok: false };
        }
        client.leave(`board:${boardId}`);
        return { ok: true };
    }
    emitNotificationToUsers(userIds, payload) {
        if (!userIds.length) {
            return;
        }
        const uniqueUserIds = Array.from(new Set(userIds.map((id) => id.trim()).filter(Boolean)));
        for (const userId of uniqueUserIds) {
            const socketIds = this.socketsByUserId.get(userId);
            if (!socketIds || socketIds.size === 0) {
                continue;
            }
            for (const socketId of socketIds) {
                this.server.to(socketId).emit('notification', payload);
            }
        }
    }
    emitBoardStateChanged(payload) {
        this.server.to(`board:${payload.boardId}`).emit('board-state-changed', payload);
    }
    emitTicketStateChanged(payload) {
        this.server.to(`board:${payload.boardId}`).emit('ticket-state-changed', payload);
    }
    handleDisconnect(client) {
        const userId = this.userIdBySocketId.get(client.id);
        if (userId) {
            const userSockets = this.socketsByUserId.get(userId);
            userSockets?.delete(client.id);
            if (!userSockets || userSockets.size === 0) {
                this.socketsByUserId.delete(userId);
            }
            this.userIdBySocketId.delete(client.id);
        }
        this.logger.log(`[ws] client disconnected: ${client.id}`);
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleConnection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('register-user'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleRegisterUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('subscribe-board'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleSubscribeBoard", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('unsubscribe-board'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleUnsubscribeBoard", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], RealtimeGateway.prototype, "handleDisconnect", null);
exports.RealtimeGateway = RealtimeGateway = RealtimeGateway_1 = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/realtime',
        cors: {
            origin: process.env.ALLOWED_ORIGIN || '*',
            credentials: true,
        },
    })
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map