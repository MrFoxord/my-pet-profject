import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BoardNotificationsService } from './board-notifications.service';
import { BoardsAccessService } from './boards-access.service';
import { ALL_TICKET_PERMISSIONS } from './boards.types';
import { CreateBoardRoleDto } from './dto/create-board-role.dto';
import { UpdateBoardRoleDto } from './dto/update-board-role.dto';

@Injectable()
export class BoardRolesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly boardsAccessService: BoardsAccessService,
    private readonly boardNotificationsService: BoardNotificationsService,
  ) {}

  private async ensureCanManageRoles(boardId: string, userId?: string) {
    const membership = await this.boardsAccessService.ensureBoardMembership(boardId, userId);
    if (!this.boardsAccessService.canManageTicketAccess(membership)) {
      throw new BadRequestException('only OWNER or ADMIN can manage board roles');
    }
  }

  async createBoardRole(boardId: string, dto: CreateBoardRoleDto, userId?: string) {
    await this.ensureCanManageRoles(boardId, userId);

    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException('role name is required');
    }

    const existing = await this.prisma.boardRole.findFirst({
      where: { boardId, name },
    });
    if (existing) {
      throw new BadRequestException('role with this name already exists');
    }

    const permissions = dto.permissions === undefined
      ? [...ALL_TICKET_PERMISSIONS]
      : this.boardsAccessService.normalizeRolePermissions(dto.permissions);

    if (dto.permissions !== undefined && permissions.length === 0) {
      throw new BadRequestException('role must include at least one valid permission');
    }

    const role = await this.prisma.boardRole.create({
      data: {
        boardId,
        name,
        permissions,
      },
    });

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Создана новая роль',
      message: `Добавлена роль: ${role.name}`,
    });

    return role;
  }

  async updateBoardRole(boardId: string, roleId: string, dto: UpdateBoardRoleDto, userId?: string) {
    await this.ensureCanManageRoles(boardId, userId);

    const existing = await this.prisma.boardRole.findFirst({
      where: { id: roleId, boardId },
    });
    if (!existing) {
      throw new BadRequestException('role not found');
    }

    const updateData: Partial<{ name: string; permissions: string[] }> = {};
    if (dto.name !== undefined) {
      const name = dto.name?.trim();
      if (!name) {
        throw new BadRequestException('role name cannot be empty');
      }
      const conflict = await this.prisma.boardRole.findFirst({
        where: { boardId, name, id: { not: roleId } },
      });
      if (conflict) {
        throw new BadRequestException('role with this name already exists');
      }
      updateData.name = name;
    }

    if (dto.permissions !== undefined) {
      const permissions = this.boardsAccessService.normalizeRolePermissions(dto.permissions);
      if (permissions.length === 0) {
        throw new BadRequestException('role must include at least one valid permission');
      }
      updateData.permissions = permissions;
    }

    const role = await this.prisma.boardRole.update({
      where: { id: roleId },
      data: updateData,
    });

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Роль обновлена',
      message: `Обновлена роль: ${role.name}`,
    });

    return role;
  }

  async deleteBoardRole(boardId: string, roleId: string, userId?: string) {
    await this.ensureCanManageRoles(boardId, userId);

    const existing = await this.prisma.boardRole.findFirst({
      where: { id: roleId, boardId },
    });
    if (!existing) {
      throw new BadRequestException('role not found');
    }

    await this.prisma.boardRole.delete({
      where: { id: roleId },
    });

    await this.boardNotificationsService.notifyBoardMembers(boardId, {
      actorUserId: userId,
      title: 'Роль удалена',
      message: `Удалена роль: ${existing.name}`,
    });
  }

  async listBoardRoles(boardId: string, userId?: string) {
    await this.boardsAccessService.ensureBoardMembership(boardId, userId);

    return this.prisma.boardRole.findMany({
      where: { boardId },
      orderBy: { createdAt: 'asc' },
    });
  }
}