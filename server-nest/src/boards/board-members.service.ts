import { BadRequestException, Injectable } from '@nestjs/common';
import { BoardMemberRole } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BoardNotificationsService } from './board-notifications.service';
import { BoardsAccessService } from './boards-access.service';
import { UpdateBoardMemberCustomRoleDto } from './dto/update-board-member-custom-role.dto';

@Injectable()
export class BoardMembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly boardsAccessService: BoardsAccessService,
    private readonly boardNotificationsService: BoardNotificationsService,
  ) {}

  async listBoardMembers(boardId: string, userId?: string) {
    await this.boardsAccessService.ensureBoardMembership(boardId, userId);

    const members = await this.prisma.boardMember.findMany({
      where: { boardId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        boardId: true,
        userId: true,
        role: true,
        customRoleId: true,
        customRole: { select: { name: true, permissions: true } },
        user: {
          select: {
            email: true,
            name: true,
            nickname: true,
          },
        },
      },
    });

    return members.map((member) => ({
      id: member.id,
      boardId: member.boardId,
      userId: member.userId,
      role: member.role,
      customRoleId: member.customRoleId,
      customRoleName: member.customRole?.name ?? null,
      customRolePermissions: member.customRole?.permissions ?? [],
      email: member.user.email ?? null,
      name: member.user.name ?? null,
      nickname: member.user.nickname ?? null,
    }));
  }

  async updateBoardMemberCustomRole(
    boardId: string,
    memberId: string,
    dto: UpdateBoardMemberCustomRoleDto,
    userId?: string,
  ) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
    if (!this.boardsAccessService.canManageTicketAccess(membership)) {
      throw new BadRequestException('only OWNER or ADMIN can assign custom roles');
    }

    const member = await this.prisma.boardMember.findFirst({
      where: { id: memberId, boardId },
      select: { id: true, boardId: true, userId: true, role: true },
    });
    if (!member) {
      throw new BadRequestException('board member not found');
    }

    let customRoleId: string | null = null;
    if (dto.customRoleId !== undefined && dto.customRoleId !== null && dto.customRoleId.trim() !== '') {
      const customRole = await this.prisma.boardRole.findFirst({
        where: { id: dto.customRoleId.trim(), boardId },
        select: { id: true },
      });
      if (!customRole) {
        throw new BadRequestException('custom role not found');
      }
      customRoleId = customRole.id;
    }

    const updated = await this.prisma.boardMember.update({
      where: { id: memberId },
      data: { customRoleId },
      select: {
        id: true,
        boardId: true,
        userId: true,
        role: true,
        customRoleId: true,
        customRole: { select: { name: true, permissions: true } },
        user: {
          select: {
            email: true,
            name: true,
            nickname: true,
          },
        },
      },
    });

    const result = {
      id: updated.id,
      boardId: updated.boardId,
      userId: updated.userId,
      role: updated.role,
      customRoleId: updated.customRoleId,
      customRoleName: updated.customRole?.name ?? null,
      customRolePermissions: updated.customRole?.permissions ?? [],
      email: updated.user.email ?? null,
      name: updated.user.name ?? null,
      nickname: updated.user.nickname ?? null,
    };

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Роль участника изменена',
      message: `Обновлена роль участника: ${result.name ?? result.nickname ?? result.email ?? result.userId}`,
    });

    return result;
  }

  async leaveBoard(boardId: string, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);

    if (membership.role === BoardMemberRole.OWNER) {
      throw new BadRequestException('board owner cannot leave board');
    }

    await this.prisma.boardMember.delete({
      where: { boardId_userId: { boardId, userId: userId! } },
    });

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Участник покинул борду',
      message: 'Один из участников покинул борду',
    });
  }

  async removeBoardMember(boardId: string, memberId: string, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
    if (!this.boardsAccessService.canManageTicketAccess(membership)) {
      throw new BadRequestException('only OWNER or ADMIN can remove board members');
    }

    const member = await this.prisma.boardMember.findFirst({
      where: { id: memberId, boardId },
      select: { id: true, userId: true, role: true },
    });

    if (!member) {
      throw new BadRequestException('board member not found');
    }

    if (member.role === BoardMemberRole.OWNER) {
      throw new BadRequestException('board owner cannot be removed');
    }

    if (userId && member.userId === userId) {
      throw new BadRequestException('you cannot remove yourself from board');
    }

    await this.prisma.boardMember.delete({
      where: { id: member.id },
    });

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Участник удален',
      message: 'Один из участников был удален из борды',
    });

    await this.boardNotificationsService.createAndDispatchNotifications([member.userId], {
      kind: 'board',
      boardId,
      title: 'Доступ к борде отозван',
      message: 'Ваш доступ к борде был удален',
    });
  }
}