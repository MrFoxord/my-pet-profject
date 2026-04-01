import { BoardMemberRole } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BoardMembershipContext, BoardMembershipLike, TicketAccessPolicy, TicketPermission } from './boards.types';
export declare class BoardsAccessService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    normalizeRolePermissions(permissions: unknown): TicketPermission[];
    normalizeTicketAccessPolicy(accessPolicy: unknown): TicketAccessPolicy;
    ensureBoardMembership(boardId: string, userId?: string): Promise<BoardMembershipContext>;
    canUseTicketPermission(accessPolicy: unknown, membership: BoardMembershipContext | BoardMembershipLike, permission: TicketPermission): boolean;
    canAccessTicket(accessPolicy: unknown, membership: BoardMembershipContext | BoardMembershipLike): boolean;
    canManageTicketAccess(membership: BoardMembershipContext | {
        role: BoardMemberRole | null;
    }): boolean;
    private getEffectiveTicketRoles;
}
