import { CanActivate, ExecutionContext, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { BoardsController } from '../src/boards/boards.controller';
import { InvitationsPublicController } from '../src/boards/invitations.public.controller';
import { BoardsService } from '../src/boards/board-workflow.service';
import { BoardInvitationsService } from '../src/boards/board-invitations.service';
import { BoardMembersService } from '../src/boards/board-members.service';
import { BoardRolesService } from '../src/boards/board-roles.service';
import { BoardStructureService } from '../src/boards/board-structure.service';
import { BoardTicketsService } from '../src/boards/board-tickets.service';
import { BoardNotificationsService } from '../src/boards/board-notifications.service';
import { BoardsAccessService } from '../src/boards/boards-access.service';
import { InternalAuthGuard } from '../src/auth/internal-auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';
import { RealtimeGateway } from '../src/realtime/realtime.gateway';
import { BoardMemberRole, InvitationType } from '../src/generated/prisma/client';

function createPrismaMock() {
  const prisma = {
    board: {
      delete: jest.fn(),
    },
    boardInvitation: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      updateMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    boardMember: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    boardRole: {
      findFirst: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  prisma.$transaction.mockImplementation(async (input: unknown) => {
    if (typeof input === 'function') {
      return input(prisma);
    }

    return Promise.all(input as Promise<unknown>[]);
  });

  return prisma;
}

function createAccessMock() {
  return {
    ensureBoardMembership: jest.fn(),
    canManageTicketAccess: jest.fn(),
    canUseTicketPermission: jest.fn(),
    canAccessTicket: jest.fn(),
    normalizeRolePermissions: jest.fn((permissions) => permissions),
    normalizeTicketAccessPolicy: jest.fn((policy) => policy),
  };
}

function createNotificationsMock() {
  return {
    notifyBoardMembers: jest.fn(),
    notifyTicketViewers: jest.fn(),
    createAndDispatchNotifications: jest.fn(),
  };
}

class TestInternalAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{ headers: Record<string, string | undefined>; serviceUser?: { sub?: string } }>();
    const rawUserId = req.headers['x-user-id'];
    req.serviceUser = rawUserId ? { sub: rawUserId } : undefined;
    return true;
  }
}

describe('Board risk flows (e2e)', () => {
  let app: INestApplication;
  let prisma: ReturnType<typeof createPrismaMock>;
  let access: ReturnType<typeof createAccessMock>;
  let notifications: ReturnType<typeof createNotificationsMock>;

  beforeAll(async () => {
    prisma = createPrismaMock();
    access = createAccessMock();
    notifications = createNotificationsMock();

    const moduleRef = await Test.createTestingModule({
      controllers: [BoardsController, InvitationsPublicController],
      providers: [
        BoardsService,
        BoardInvitationsService,
        { provide: BoardMembersService, useValue: {} },
        { provide: BoardRolesService, useValue: {} },
        { provide: BoardStructureService, useValue: {} },
        { provide: BoardTicketsService, useValue: {} },
        { provide: BoardsAccessService, useValue: access },
        { provide: BoardNotificationsService, useValue: notifications },
        { provide: PrismaService, useValue: prisma },
        {
          provide: RealtimeGateway,
          useValue: {
            emitBoardStateChanged: jest.fn(),
            emitTicketStateChanged: jest.fn(),
            emitNotificationToUsers: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(InternalAuthGuard)
      .useValue(new TestInternalAuthGuard())
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
    access.ensureBoardMembership.mockReset();
    access.canManageTicketAccess.mockReset();
    access.canUseTicketPermission.mockReset();
    access.canAccessTicket.mockReset();
    access.normalizeRolePermissions.mockImplementation((permissions) => permissions);
    access.normalizeTicketAccessPolicy.mockImplementation((policy) => policy);
    prisma.$transaction.mockImplementation(async (input: unknown) => {
      if (typeof input === 'function') {
        return input(prisma);
      }

      return Promise.all(input as Promise<unknown>[]);
    });
  });

  it('rejects DELETE /boards/:boardId for non-owner membership', async () => {
    access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.ADMIN });

    const response = await request(app.getHttpServer())
      .delete('/boards/board-1')
      .set('x-user-id', 'admin-1')
      .expect(400);

    expect(response.body.message).toBe('only board owner can delete board');
    expect(prisma.board.delete).not.toHaveBeenCalled();
  });

  it('deletes the board for owner membership', async () => {
    access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.OWNER });
    prisma.board.delete.mockResolvedValue({ id: 'board-1' });

    const response = await request(app.getHttpServer())
      .delete('/boards/board-1')
      .set('x-user-id', 'owner-1')
      .expect(200);

    expect(response.body).toEqual({ ok: true });
    expect(prisma.board.delete).toHaveBeenCalledWith({ where: { id: 'board-1' } });
  });

  it('revokes a board invitation over HTTP', async () => {
    access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.ADMIN });
    access.canManageTicketAccess.mockReturnValue(true);
    prisma.boardInvitation.findFirst.mockResolvedValue({ id: 'inv-1' });
    prisma.boardInvitation.delete.mockResolvedValue({ id: 'inv-1' });

    const response = await request(app.getHttpServer())
      .delete('/boards/board-1/invitations/inv-1')
      .set('x-user-id', 'member-1')
      .expect(200);

    expect(response.body).toEqual({ ok: true });
    expect(prisma.boardInvitation.delete).toHaveBeenCalledWith({ where: { id: 'inv-1' } });
    expect(notifications.notifyBoardMembers).toHaveBeenCalledWith('board-1', {
      actorUserId: 'member-1',
      title: 'Инвайт удален',
      message: 'Одна из invite-ссылок была удалена',
    });
  });

  it('rejects DELETE /boards/:boardId/invitations/:invitationId for non-admin membership', async () => {
    access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.MEMBER });
    access.canManageTicketAccess.mockReturnValue(false);

    const response = await request(app.getHttpServer())
      .delete('/boards/board-1/invitations/inv-1')
      .set('x-user-id', 'member-1')
      .expect(400);

    expect(response.body.message).toBe('only OWNER or ADMIN can manage board invitations');
    expect(prisma.boardInvitation.delete).not.toHaveBeenCalled();
  });

  it('accepts an invitation by id and creates a board member', async () => {
    const invitation = {
      id: 'inv-1',
      token: 'inv_token',
      type: InvitationType.SHARED,
      email: null,
      boardId: 'board-1',
      customRoleId: null,
      customRoleName: null,
      createdByUserId: 'admin-1',
      status: 'pending',
      maxUses: 1,
      usedCount: 0,
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date('2026-04-01T10:00:00.000Z'),
    };

    prisma.boardInvitation.findFirst.mockResolvedValue(invitation);
    prisma.user.findUnique.mockResolvedValue({ email: 'new-user@example.com' });
    prisma.boardMember.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    prisma.boardInvitation.updateMany.mockResolvedValue({ count: 1 });
    prisma.boardInvitation.findUnique.mockResolvedValue({ usedCount: 1, maxUses: 1 });
    prisma.boardInvitation.update.mockResolvedValue({ id: 'inv-1', status: 'accepted' });
    prisma.boardMember.create.mockResolvedValue({ id: 'member-1' });

    const response = await request(app.getHttpServer())
      .post('/boards/board-1/invitations/inv-1/accept')
      .set('x-user-id', 'user-2')
      .expect(201);

    expect(response.body).toEqual({ success: true, boardId: 'board-1', alreadyMember: false });
    expect(prisma.boardMember.create).toHaveBeenCalledWith({
      data: {
        boardId: 'board-1',
        userId: 'user-2',
        role: BoardMemberRole.MEMBER,
        customRoleId: null,
      },
    });
    expect(notifications.notifyBoardMembers).toHaveBeenCalledWith('board-1', {
      actorUserId: 'user-2',
      title: 'Инвайт принят',
      message: 'Новый участник присоединился к борде по приглашению',
    });
  });

  it('rejects public token acceptance when invitation email mismatches user email', async () => {
    prisma.boardInvitation.findUnique.mockResolvedValue({
      id: 'inv-2',
      token: 'public_token',
      type: InvitationType.PERSONAL,
      email: 'expected@example.com',
      boardId: 'board-1',
      customRoleId: null,
      customRoleName: null,
      createdByUserId: 'admin-1',
      status: 'pending',
      maxUses: 1,
      usedCount: 0,
      expiresAt: new Date(Date.now() + 60_000),
      createdAt: new Date('2026-04-01T10:00:00.000Z'),
    });
    prisma.user.findUnique.mockResolvedValue({ email: 'other@example.com' });
    prisma.boardMember.findUnique.mockResolvedValue(null);

    const response = await request(app.getHttpServer())
      .post('/invitations/public_token/accept')
      .set('x-user-id', 'user-3')
      .send({})
      .expect(400);

    expect(response.body.message).toBe('invitation email mismatch');
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});