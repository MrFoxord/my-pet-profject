import { BadRequestException, Injectable } from '@nestjs/common';
import { BoardMemberRole } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  ALL_TICKET_PERMISSIONS,
  BoardMembershipContext,
  BoardMembershipLike,
  TicketAccessPolicy,
  TicketPermission,
} from './boards.types';

@Injectable()
export class BoardsAccessService {
  constructor(private readonly prisma: PrismaService) {}

  normalizeRolePermissions(permissions: unknown): TicketPermission[] {
    if (!Array.isArray(permissions)) {
      return [];
    }

    const validPermissions = new Set<TicketPermission>(ALL_TICKET_PERMISSIONS);

    return Array.from(
      new Set(
        permissions
          .filter((permission): permission is string => typeof permission === 'string')
          .map((permission) => permission.trim() as TicketPermission)
          .filter((permission) => validPermissions.has(permission)),
      ),
    );
  }

  normalizeTicketAccessPolicy(accessPolicy: unknown): TicketAccessPolicy {
    const source = (accessPolicy && typeof accessPolicy === 'object' ? accessPolicy : {}) as Record<string, unknown>;

    const getRoles = (key: TicketPermission): string[] => {
      const value = source[key];
      if (!Array.isArray(value)) {
        return [];
      }

      const normalized = value
        .filter((role): role is string => typeof role === 'string')
        .map((role) => role.trim())
        .filter(Boolean);

      return Array.from(new Set(normalized));
    };

    return {
      view: getRoles('view'),
      fill: getRoles('fill'),
      edit: getRoles('edit'),
      delete: getRoles('delete'),
      estimate: getRoles('estimate'),
      comment: getRoles('comment'),
      manageAccess: getRoles('manageAccess'),
    };
  }

  async ensureBoardMembership(boardId: string, userId?: string): Promise<BoardMembershipContext> {
    if (!userId) {
      throw new BadRequestException('user is required');
    }

    const membership = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
      select: {
        id: true,
        role: true,
        customRole: { select: { name: true, permissions: true } },
      },
    });

    if (!membership) {
      throw new BadRequestException('board access denied');
    }

    return {
      role: membership.role,
      customRoleName: membership.customRole?.name ?? null,
      customRolePermissions: this.normalizeRolePermissions(membership.customRole?.permissions ?? []),
    };
  }

  canUseTicketPermission(
    accessPolicy: unknown,
    membership: BoardMembershipContext | BoardMembershipLike,
    permission: TicketPermission,
  ): boolean {
    if (!membership.role) {
      return false;
    }

    if (this.canManageTicketAccess(membership)) {
      return true;
    }

    if (membership.customRoleName?.trim() && membership.customRolePermissions.length > 0) {
      const customRolePermissions = new Set(membership.customRolePermissions);
      if (!customRolePermissions.has(permission)) {
        return false;
      }
    }

    const normalizedPolicy = this.normalizeTicketAccessPolicy(accessPolicy);
    const allowedRoles = normalizedPolicy[permission] ?? [];
    if (!allowedRoles.length) {
      return true;
    }

    const effectiveRoles = this.getEffectiveTicketRoles(membership);
    return allowedRoles.some((role) => effectiveRoles.has(role.toLowerCase()));
  }

  canAccessTicket(accessPolicy: unknown, membership: BoardMembershipContext | BoardMembershipLike): boolean {
    return this.canUseTicketPermission(accessPolicy, membership, 'view');
  }

  canManageTicketAccess(membership: BoardMembershipContext | { role: BoardMemberRole | null }): boolean {
    return membership.role === BoardMemberRole.OWNER || membership.role === BoardMemberRole.ADMIN;
  }

  private getEffectiveTicketRoles(membership: BoardMembershipLike): Set<string> {
    const roles = new Set<string>();
    if (membership.role) {
      roles.add(membership.role.toLowerCase());
    }

    const customRoleName = membership.customRoleName?.trim().toLowerCase();
    if (customRoleName) {
      roles.add(customRoleName);
    }

    return roles;
  }
}