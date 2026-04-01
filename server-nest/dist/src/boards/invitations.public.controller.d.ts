import { Request } from 'express';
import { BoardInvitationsService } from './board-invitations.service';
import { ServiceJwtPayload } from '../auth/internal-auth.guard';
type AuthRequest = Request & {
    serviceUser?: ServiceJwtPayload;
};
export declare class InvitationsPublicController {
    private readonly boardInvitationsService;
    constructor(boardInvitationsService: BoardInvitationsService);
    getInvitationByToken(token: string): Promise<{
        id: string;
        token: string;
        type: import("../generated/prisma/enums").InvitationType;
        email: string;
        boardId: string;
        customRoleId: string;
        customRoleName: string;
        createdByUserId: string;
        status: string;
        state: import("./boards.types").InvitationState;
        maxUses: number;
        usedCount: number;
        expiresAt: Date;
        createdAt: Date;
        board: {
            id: string;
            title: string;
            logoUrl: string;
        };
    }>;
    acceptInvitationByToken(token: string, req: AuthRequest): Promise<{
        success: boolean;
        boardId: string;
        alreadyMember: boolean;
    }>;
}
export {};
