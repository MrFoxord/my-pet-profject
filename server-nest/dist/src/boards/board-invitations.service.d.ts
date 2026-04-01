import { InvitationType } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BoardNotificationsService } from './board-notifications.service';
import { BoardsAccessService } from './boards-access.service';
import { CreateBoardInvitationDto } from './dto/create-board-invitation.dto';
import { InvitationRecord, InvitationState } from './boards.types';
export declare class BoardInvitationsService {
    private readonly prisma;
    private readonly boardsAccessService;
    private readonly boardNotificationsService;
    constructor(prisma: PrismaService, boardsAccessService: BoardsAccessService, boardNotificationsService: BoardNotificationsService);
    private ensureCanManageInvitations;
    createBoardInvitation(boardId: string, dto: CreateBoardInvitationDto, userId?: string): Promise<{
        id: string;
        boardId: string;
        type: InvitationType;
        email: string;
        customRoleId: string;
        customRoleName: string;
        createdByUserId: string;
        status: string;
        state: InvitationState;
        maxUses: number;
        usedCount: number;
        expiresAt: Date;
        createdAt: Date;
        token: string;
        shareUrl: string;
    }>;
    listBoardInvitations(boardId: string, userId?: string): Promise<{
        id: string;
        boardId: string;
        type: InvitationType;
        email: string;
        customRoleId: string;
        customRoleName: string;
        createdByUserId: string;
        status: string;
        state: InvitationState;
        maxUses: number;
        usedCount: number;
        expiresAt: Date;
        createdAt: Date;
        token: string;
        shareUrl: string;
    }[]>;
    acceptBoardInvitation(boardId: string, invitationId: string, userId?: string): Promise<{
        success: boolean;
        boardId: string;
        alreadyMember: boolean;
    }>;
    revokeBoardInvitation(boardId: string, invitationId: string, userId?: string): Promise<void>;
    getInvitationByToken(token: string): Promise<{
        id: string;
        token: string;
        type: InvitationType;
        email: string;
        boardId: string;
        customRoleId: string;
        customRoleName: string;
        createdByUserId: string;
        status: string;
        state: InvitationState;
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
    acceptInvitationByToken(token: string, userId?: string): Promise<{
        success: boolean;
        boardId: string;
        alreadyMember: boolean;
    }>;
    getInvitationState(invitation: Pick<InvitationRecord, 'type' | 'status' | 'expiresAt' | 'usedCount' | 'maxUses'>): InvitationState;
    private generateInvitationToken;
    private getInvitationExpiryDate;
    private getSharedInvitationMaxUses;
    private ensureInvitationCanBeAccepted;
    private mapInvitation;
    private resolveInvitationCustomRole;
    private acceptInvitationRecord;
}
