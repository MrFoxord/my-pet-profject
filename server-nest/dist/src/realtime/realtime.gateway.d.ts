import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket } from 'socket.io';
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
    reason: 'columns_changed' | 'tickets_changed' | 'members_changed' | 'roles_changed' | 'invitations_changed';
};
export type TicketStateChangedPayload = {
    boardId: string;
    ticketId: string;
    actorUserId?: string;
    action: 'created' | 'updated' | 'deleted' | 'reordered';
    source?: 'ticket' | 'comment';
};
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger;
    private readonly server;
    private readonly socketsByUserId;
    private readonly userIdBySocketId;
    handleConnection(client: Socket): void;
    handleRegisterUser(client: Socket, payload: {
        userId?: string;
    }): {
        ok: boolean;
    };
    handleSubscribeBoard(client: Socket, payload: {
        boardId?: string;
    }): {
        ok: boolean;
    };
    handleUnsubscribeBoard(client: Socket, payload: {
        boardId?: string;
    }): {
        ok: boolean;
    };
    emitNotificationToUsers(userIds: string[], payload: RealtimeNotificationPayload): void;
    emitBoardStateChanged(payload: BoardStateChangedPayload): void;
    emitTicketStateChanged(payload: TicketStateChangedPayload): void;
    handleDisconnect(client: Socket): void;
}
