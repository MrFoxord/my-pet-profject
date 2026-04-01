import {
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

export type RealtimeNotificationPayload = {
  id: string;
  kind: 'board' | 'ticket';
  boardId: string;
  ticketId?: string;
  title: string;
  message: string;
  isRead?: boolean;
  unreadCount?: number;
  createdAt: string;
};

export type BoardStateChangedPayload = {
  boardId: string;
  actorUserId?: string;
  reason:
    | 'columns_changed'
    | 'tickets_changed'
    | 'members_changed'
    | 'roles_changed'
    | 'invitations_changed'
    | 'settings_changed';
};

export type TicketStateChangedPayload = {
  boardId: string;
  ticketId: string;
  actorUserId?: string;
  action: 'created' | 'updated' | 'deleted' | 'reordered';
  source?: 'ticket' | 'comment';
};

@WebSocketGateway({
  namespace: '/realtime',
  cors: {
    origin: process.env.ALLOWED_ORIGIN || '*',
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  private readonly server: Server;

  private readonly socketsByUserId = new Map<string, Set<string>>();
  private readonly userIdBySocketId = new Map<string, string>();

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.log(`[ws] client connected: ${client.id}`);
  }

  @SubscribeMessage('register-user')
  handleRegisterUser(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId?: string },
  ) {
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
    const userSockets = this.socketsByUserId.get(userId) ?? new Set<string>();
    userSockets.add(client.id);
    this.socketsByUserId.set(userId, userSockets);

    return { ok: true };
  }

  @SubscribeMessage('subscribe-board')
  handleSubscribeBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { boardId?: string },
  ) {
    const boardId = payload?.boardId?.trim();
    if (!boardId) {
      return { ok: false };
    }

    client.join(`board:${boardId}`);
    return { ok: true };
  }

  @SubscribeMessage('unsubscribe-board')
  handleUnsubscribeBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { boardId?: string },
  ) {
    const boardId = payload?.boardId?.trim();
    if (!boardId) {
      return { ok: false };
    }

    client.leave(`board:${boardId}`);
    return { ok: true };
  }

  emitNotificationToUsers(userIds: string[], payload: RealtimeNotificationPayload) {
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

  emitBoardStateChanged(payload: BoardStateChangedPayload) {
    this.server.to(`board:${payload.boardId}`).emit('board-state-changed', payload);
  }

  emitTicketStateChanged(payload: TicketStateChangedPayload) {
    this.server.to(`board:${payload.boardId}`).emit('ticket-state-changed', payload);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
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
}