import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';
import { BoardMemberRole, InvitationType } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BoardNotificationsService } from './board-notifications.service';
import { BoardsAccessService } from './boards-access.service';
import { CreateBoardInvitationDto, SharedInvitationMode } from './dto/create-board-invitation.dto';
import { InvitationRecord, InvitationState } from './boards.types';

@Injectable()
export class BoardInvitationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly boardsAccessService: BoardsAccessService,
    private readonly boardNotificationsService: BoardNotificationsService,
  ) {}

  private async ensureCanManageInvitations(boardId: string, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
    if (!this.boardsAccessService.canManageTicketAccess(membership)) {
      throw new BadRequestException('only OWNER or ADMIN can manage board invitations');
    }
  }

  async createBoardInvitation(boardId: string, dto: CreateBoardInvitationDto, userId?: string) {
    await this.ensureCanManageInvitations(boardId, userId);

    const board = await this.prisma.board.findUnique({
      where: { id: boardId },
      select: {
        id: true,
        allowPersonalInvites: true,
        allowSharedInvites: true,
        defaultSharedInvitationMode: true,
        inviteExpiresHours: true,
        sharedInviteMaxUses: true,
      },
    });

    if (!board) {
      throw new NotFoundException('board not found');
    }

    const { customRoleId, customRoleName } = await this.resolveInvitationCustomRole(
      boardId,
      dto.customRoleId,
    );
    const expiresAt = this.getInvitationExpiryDate(board.inviteExpiresHours);
    const token = this.generateInvitationToken();

    if (dto.type === InvitationType.PERSONAL) {
      if (!board.allowPersonalInvites) {
        throw new BadRequestException('personal invitations are disabled for this board');
      }

      const email = dto.email?.trim().toLowerCase();
      if (!email) {
        throw new BadRequestException('email is required for personal invitation');
      }

      const existingInvitation = await this.prisma.boardInvitation.findFirst({
        where: {
          boardId,
          type: InvitationType.PERSONAL,
          email,
          status: 'pending',
        },
        orderBy: { createdAt: 'desc' },
      });

      const invitation = existingInvitation
        ? await this.prisma.boardInvitation.update({
            where: { id: existingInvitation.id },
            data: {
              token,
              customRoleId,
              customRoleName,
              createdByUserId: userId ?? null,
              status: 'pending',
              maxUses: 1,
              usedCount: 0,
              expiresAt,
            },
          })
        : await this.prisma.boardInvitation.create({
            data: {
              token,
              type: InvitationType.PERSONAL,
              email,
              boardId,
              customRoleId,
              customRoleName,
              createdByUserId: userId ?? null,
              status: 'pending',
              maxUses: 1,
              usedCount: 0,
              expiresAt,
            },
          });

      const mapped = this.mapInvitation(invitation);

      await this.boardNotificationsService.notifyBoardMembers(boardId, {
        actorUserId: userId,
        title: 'Новый инвайт',
        message: `Создан персональный инвайт для ${email}`,
      });

      return mapped;
    }

    if (!board.allowSharedInvites) {
      throw new BadRequestException('shared invitations are disabled for this board');
    }

    const sharedInvitationMode = dto.sharedInvitationMode ?? board.defaultSharedInvitationMode;
    const maxUses =
      sharedInvitationMode === SharedInvitationMode.MULTI_USE
        ? this.getSharedInvitationMaxUses(board.sharedInviteMaxUses)
        : 1;

    const invitation = await this.prisma.boardInvitation.create({
      data: {
        token,
        type: InvitationType.SHARED,
        email: null,
        boardId,
        customRoleId,
        customRoleName,
        createdByUserId: userId ?? null,
        status: 'pending',
        maxUses,
        usedCount: 0,
        expiresAt,
      },
    });

    const mapped = this.mapInvitation(invitation);

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Новый инвайт',
      message: 'Создана новая shared invite-ссылка',
    });

    return mapped;
  }

  async listBoardInvitations(boardId: string, userId?: string) {
    await this.ensureCanManageInvitations(boardId, userId);

    const invitations = await this.prisma.boardInvitation.findMany({
      where: { boardId },
      orderBy: { createdAt: 'desc' },
    });

    return invitations.map((invitation) => this.mapInvitation(invitation));
  }

  async acceptBoardInvitation(boardId: string, invitationId: string, userId?: string) {
    const invitation = await this.prisma.boardInvitation.findFirst({
      where: { id: invitationId, boardId },
    });

    if (!invitation) {
      throw new NotFoundException('invitation not found');
    }

    const accepted = await this.acceptInvitationRecord(invitation, userId);

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Инвайт принят',
      message: 'Новый участник присоединился к борде по приглашению',
    });

    return accepted;
  }

  async revokeBoardInvitation(boardId: string, invitationId: string, userId?: string) {
    await this.ensureCanManageInvitations(boardId, userId);

    const existing = await this.prisma.boardInvitation.findFirst({
      where: { id: invitationId, boardId },
      select: { id: true },
    });

    if (!existing) {
      throw new BadRequestException('invitation not found');
    }

    await this.prisma.boardInvitation.delete({
      where: { id: invitationId },
    });

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Инвайт удален',
      message: 'Одна из invite-ссылок была удалена',
    });
  }

  async getInvitationByToken(token: string) {
    const invitation = await this.prisma.boardInvitation.findUnique({
      where: { token },
      select: {
        id: true,
        token: true,
        type: true,
        email: true,
        boardId: true,
        customRoleId: true,
        customRoleName: true,
        createdByUserId: true,
        status: true,
        maxUses: true,
        usedCount: true,
        expiresAt: true,
        createdAt: true,
        board: {
          select: {
            id: true,
            title: true,
            logoUrl: true,
          },
        },
      },
    });

    if (!invitation) {
      throw new NotFoundException('invitation not found');
    }

    return {
      id: invitation.id,
      token: invitation.token,
      type: invitation.type,
      email: invitation.email,
      boardId: invitation.boardId,
      customRoleId: invitation.customRoleId,
      customRoleName: invitation.customRoleName,
      createdByUserId: invitation.createdByUserId,
      status: invitation.status,
      state: this.getInvitationState(invitation),
      maxUses: invitation.maxUses,
      usedCount: invitation.usedCount,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      board: invitation.board,
    };
  }

  async acceptInvitationByToken(token: string, userId?: string) {
    const invitation = await this.prisma.boardInvitation.findUnique({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('invitation not found');
    }

    return this.acceptInvitationRecord(invitation, userId);
  }

  getInvitationState(
    invitation: Pick<InvitationRecord, 'type' | 'status' | 'expiresAt' | 'usedCount' | 'maxUses'>,
  ): InvitationState {
    if (invitation.status === 'declined') {
      return 'revoked';
    }

    if (invitation.expiresAt.getTime() < Date.now()) {
      return 'expired';
    }

    if (invitation.type === InvitationType.SHARED && invitation.usedCount >= invitation.maxUses) {
      return 'limit_reached';
    }

    if (invitation.status !== 'pending') {
      return 'accepted';
    }

    return 'pending';
  }

  private generateInvitationToken(): string {
    const randomHex = crypto.randomBytes(12).toString('hex');
    return `inv_${randomHex}`;
  }

  private getInvitationExpiryDate(overrideHours?: number): Date {
    const ttlHours = Number(overrideHours ?? process.env.INVITE_EXPIRES_HOURS ?? '168');
    const safeHours = Number.isFinite(ttlHours) && ttlHours > 0 ? ttlHours : 168;
    return new Date(Date.now() + safeHours * 60 * 60 * 1000);
  }

  private getSharedInvitationMaxUses(overrideMaxUses?: number): number {
    const maxUses = Number(overrideMaxUses ?? process.env.INVITE_SHARED_MAX_USES ?? '10');
    return Number.isInteger(maxUses) && maxUses > 1 ? maxUses : 10;
  }

  private ensureInvitationCanBeAccepted(invitation: InvitationRecord): void {
    const state = this.getInvitationState(invitation);

    if (state === 'pending') {
      return;
    }

    if (state === 'revoked') {
      throw new BadRequestException('invitation is revoked');
    }

    if (state === 'expired') {
      throw new BadRequestException('invitation is expired');
    }

    if (state === 'limit_reached') {
      throw new BadRequestException('invitation limit reached');
    }

    throw new BadRequestException('invitation already accepted');
  }

  private mapInvitation(invitation: InvitationRecord) {
    return {
      id: invitation.id,
      boardId: invitation.boardId,
      type: invitation.type,
      email: invitation.email,
      customRoleId: invitation.customRoleId,
      customRoleName: invitation.customRoleName,
      createdByUserId: invitation.createdByUserId,
      status: invitation.status,
      state: this.getInvitationState(invitation),
      maxUses: invitation.maxUses,
      usedCount: invitation.usedCount,
      expiresAt: invitation.expiresAt,
      createdAt: invitation.createdAt,
      token: invitation.token,
      shareUrl: `/invite/${invitation.token}`,
    };
  }

  private async resolveInvitationCustomRole(boardId: string, customRoleId?: string | null) {
    const normalizedRoleId = customRoleId?.trim();
    if (!normalizedRoleId) {
      return { customRoleId: null, customRoleName: null };
    }

    const customRole = await this.prisma.boardRole.findFirst({
      where: { id: normalizedRoleId, boardId },
      select: { id: true, name: true },
    });

    if (!customRole) {
      throw new BadRequestException('custom role not found');
    }

    return {
      customRoleId: customRole.id,
      customRoleName: customRole.name,
    };
  }

  private async acceptInvitationRecord(invitation: InvitationRecord, userId?: string) {
    if (!userId) {
      throw new BadRequestException('user is required to accept invitation');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user?.email) {
      throw new BadRequestException('user email is required');
    }

    const existingMember = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId: invitation.boardId, userId } },
      select: { id: true },
    });

    if (existingMember) {
      if (invitation.type === InvitationType.PERSONAL) {
        await this.prisma.boardInvitation.updateMany({
          where: { id: invitation.id, status: 'pending' },
          data: { status: 'accepted', usedCount: invitation.maxUses },
        });
      }

      return { success: true, boardId: invitation.boardId, alreadyMember: true };
    }

    const userEmail = user.email.toLowerCase();

    if (invitation.type === InvitationType.PERSONAL) {
      const invitationEmail = invitation.email?.toLowerCase();
      if (!invitationEmail) {
        throw new BadRequestException('invitation email is missing');
      }
      if (invitationEmail !== userEmail) {
        throw new BadRequestException('invitation email mismatch');
      }
    }

    this.ensureInvitationCanBeAccepted(invitation);

    const result = await this.prisma.$transaction(async (tx) => {
      const existingMemberInTx = await tx.boardMember.findUnique({
        where: { boardId_userId: { boardId: invitation.boardId, userId } },
        select: { id: true },
      });

      if (existingMemberInTx) {
        if (invitation.type === InvitationType.PERSONAL) {
          await tx.boardInvitation.updateMany({
            where: { id: invitation.id, status: 'pending' },
            data: { status: 'accepted', usedCount: invitation.maxUses },
          });
        }

        return { success: true, boardId: invitation.boardId, alreadyMember: true };
      }

      if (invitation.customRoleId) {
        const customRole = await tx.boardRole.findFirst({
          where: { id: invitation.customRoleId, boardId: invitation.boardId },
          select: { id: true },
        });

        if (!customRole) {
          throw new BadRequestException('invitation custom role is missing');
        }
      }

      const reserved = await tx.boardInvitation.updateMany({
        where: {
          id: invitation.id,
          status: 'pending',
          expiresAt: { gt: new Date() },
          usedCount: { lt: invitation.maxUses },
        },
        data: {
          usedCount: { increment: 1 },
        },
      });

      if (reserved.count !== 1) {
        const latestInvitation = await tx.boardInvitation.findUnique({
          where: { id: invitation.id },
          select: {
            id: true,
            token: true,
            type: true,
            email: true,
            boardId: true,
            customRoleId: true,
            customRoleName: true,
            createdByUserId: true,
            status: true,
            maxUses: true,
            usedCount: true,
            expiresAt: true,
            createdAt: true,
          },
        });

        if (!latestInvitation) {
          throw new NotFoundException('invitation not found');
        }

        this.ensureInvitationCanBeAccepted(latestInvitation);
      }

      const currentInvitation = await tx.boardInvitation.findUnique({
        where: { id: invitation.id },
        select: { usedCount: true, maxUses: true },
      });

      if (!currentInvitation) {
        throw new NotFoundException('invitation not found');
      }

      if (currentInvitation.usedCount >= currentInvitation.maxUses) {
        await tx.boardInvitation.update({
          where: { id: invitation.id },
          data: { status: 'accepted' },
        });
      }

      await tx.boardMember.create({
        data: {
          boardId: invitation.boardId,
          userId,
          role: BoardMemberRole.MEMBER,
          customRoleId: invitation.customRoleId ?? null,
        },
      });

      return { success: true, boardId: invitation.boardId, alreadyMember: false };
    });

    return result;
  }
}