import { BadRequestException } from '@nestjs/common';
import { BoardMemberRole, InvitationType } from '../generated/prisma/client';
import { BoardInvitationsService } from './board-invitations.service';
import { BoardMembersService } from './board-members.service';
import { BoardNotificationsService } from './board-notifications.service';
import { BoardRolesService } from './board-roles.service';
import { BoardTicketsService } from './board-tickets.service';
import { BoardsAccessService } from './boards-access.service';
import { BoardsService } from './board-workflow.service';
import { ALL_TICKET_PERMISSIONS } from './boards.types';
import { SharedInvitationMode } from './dto/create-board-invitation.dto';

function createPrismaMock() {
  return {
    board: {
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    },
    boardInvitation: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    boardRole: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
    },
    boardMember: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    boardColumn: {
      findFirst: jest.fn(),
    },
    ticket: {
      aggregate: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    comment: {
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn(),
  };
}

function createAccessMock() {
  return {
    ensureBoardMembership: jest.fn(),
    canManageTicketAccess: jest.fn(),
    canUseTicketPermission: jest.fn(),
    canAccessTicket: jest.fn(),
    normalizeRolePermissions: jest.fn((permissions) => permissions),
    normalizeTicketAccessPolicy: jest.fn((policy) =>
      policy ?? {
        view: [],
        fill: [],
        edit: [],
        delete: [],
        estimate: [],
        comment: [],
        manageAccess: [],
      }),
  };
}

function createNotificationsMock() {
  return {
    notifyBoardMembers: jest.fn(),
    notifyTicketViewers: jest.fn(),
    createAndDispatchNotifications: jest.fn(),
  };
}

function createRealtimeMock() {
  return {
    emitBoardStateChanged: jest.fn(),
    emitTicketStateChanged: jest.fn(),
    emitNotificationToUsers: jest.fn(),
  };
}

describe('Boards domain guardrails', () => {
  describe('BoardsAccessService', () => {
    const service = new BoardsAccessService({} as never);

    it('normalizes role permissions by dropping invalid values and duplicates', () => {
      expect(service.normalizeRolePermissions(['view', 'edit', 'edit', ' bogus ', 123, 'delete'])).toEqual([
        'view',
        'edit',
        'delete',
      ]);
    });

    it('blocks permissions outside the assigned custom role ceiling', () => {
      const allowed = service.canUseTicketPermission(
        { edit: ['qa'] },
        {
          role: BoardMemberRole.MEMBER,
          customRoleName: 'qa',
          customRolePermissions: ['view'],
        },
        'edit',
      );

      expect(allowed).toBe(false);
    });

    it('allows permission when both custom role ceiling and access policy permit it', () => {
      const allowed = service.canUseTicketPermission(
        { comment: ['qa'] },
        {
          role: BoardMemberRole.MEMBER,
          customRoleName: 'qa',
          customRolePermissions: ['comment'],
        },
        'comment',
      );

      expect(allowed).toBe(true);
    });
  });

  describe('BoardInvitationsService', () => {
    it('rejects invitation creation for non-admin memberships', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const service = new BoardInvitationsService(prisma as never, access as never, notifications as never);

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.MEMBER });
      access.canManageTicketAccess.mockReturnValue(false);

      await expect(
        service.createBoardInvitation(
          'board-1',
          { type: InvitationType.PERSONAL, email: 'user@example.com' },
          'member-1',
        ),
      ).rejects.toThrow('only OWNER or ADMIN can manage board invitations');
    });

    it('rejects personal invitations when board policy disables them', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const service = new BoardInvitationsService(prisma as never, access as never, notifications as never);

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.ADMIN });
      access.canManageTicketAccess.mockReturnValue(true);
      prisma.board.findUnique.mockResolvedValue({
        id: 'board-1',
        allowPersonalInvites: false,
        allowSharedInvites: true,
        defaultSharedInvitationMode: SharedInvitationMode.SINGLE_USE,
        inviteExpiresHours: 24,
        sharedInviteMaxUses: 5,
      });

      await expect(
        service.createBoardInvitation(
          'board-1',
          { type: InvitationType.PERSONAL, email: 'user@example.com' },
          'admin-1',
        ),
      ).rejects.toThrow(BadRequestException);

      expect(prisma.boardInvitation.create).not.toHaveBeenCalled();
    });

    it('creates a multi-use shared invitation using board defaults', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const service = new BoardInvitationsService(prisma as never, access as never, notifications as never);
      const createdAt = new Date('2026-04-01T10:00:00.000Z');
      const expiresAt = new Date('2026-04-08T10:00:00.000Z');

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.ADMIN });
      access.canManageTicketAccess.mockReturnValue(true);
      prisma.board.findUnique.mockResolvedValue({
        id: 'board-1',
        allowPersonalInvites: true,
        allowSharedInvites: true,
        defaultSharedInvitationMode: SharedInvitationMode.MULTI_USE,
        inviteExpiresHours: 168,
        sharedInviteMaxUses: 7,
      });
      prisma.boardInvitation.create.mockResolvedValue({
        id: 'inv-1',
        token: 'inv_token',
        type: InvitationType.SHARED,
        email: null,
        boardId: 'board-1',
        customRoleId: null,
        customRoleName: null,
        createdByUserId: 'admin-1',
        status: 'pending',
        maxUses: 7,
        usedCount: 0,
        expiresAt,
        createdAt,
      });

      const invitation = await service.createBoardInvitation(
        'board-1',
        { type: InvitationType.SHARED, sharedInvitationMode: SharedInvitationMode.MULTI_USE },
        'admin-1',
      );

      expect(prisma.boardInvitation.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            type: InvitationType.SHARED,
            boardId: 'board-1',
            maxUses: 7,
          }),
        }),
      );
      expect(invitation.shareUrl).toBe('/invite/inv_token');
      expect(notifications.notifyBoardMembers).toHaveBeenCalled();
    });

    it('rejects invitation listing for non-admin memberships', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const service = new BoardInvitationsService(prisma as never, access as never, notifications as never);

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.VIEWER });
      access.canManageTicketAccess.mockReturnValue(false);

      await expect(service.listBoardInvitations('board-1', 'viewer-1')).rejects.toThrow(
        'only OWNER or ADMIN can manage board invitations',
      );
    });

    it('rejects accepting a personal invitation with mismatched email', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const service = new BoardInvitationsService(prisma as never, access as never, notifications as never);

      prisma.boardInvitation.findUnique.mockResolvedValue({
        id: 'inv-1',
        token: 'inv_token',
        type: InvitationType.PERSONAL,
        email: 'invited@example.com',
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

      await expect(service.acceptInvitationByToken('inv_token', 'user-1')).rejects.toThrow(
        'invitation email mismatch',
      );

      expect(prisma.$transaction).not.toHaveBeenCalled();
      expect(notifications.notifyBoardMembers).not.toHaveBeenCalled();
    });
  });

  describe('BoardMembersService', () => {
    it('rejects custom role assignment for members without management access', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const service = new BoardMembersService(prisma as never, access as never, notifications as never);

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.MEMBER });
      access.canManageTicketAccess.mockReturnValue(false);

      await expect(
        service.updateBoardMemberCustomRole('board-1', 'member-1', { customRoleId: 'role-1' }, 'user-1'),
      ).rejects.toThrow('only OWNER or ADMIN can assign custom roles');
    });

    it('prevents the board owner from leaving', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const service = new BoardMembersService(prisma as never, access as never, notifications as never);

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.OWNER });

      await expect(service.leaveBoard('board-1', 'owner-1')).rejects.toThrow('board owner cannot leave board');

      expect(prisma.boardMember.delete).not.toHaveBeenCalled();
    });

    it('removes a member and dispatches an access revoked notification', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const service = new BoardMembersService(prisma as never, access as never, notifications as never);

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.ADMIN });
      access.canManageTicketAccess.mockReturnValue(true);
      prisma.boardMember.findFirst.mockResolvedValue({
        id: 'member-2',
        userId: 'user-2',
        role: BoardMemberRole.MEMBER,
      });
      prisma.boardMember.delete.mockResolvedValue({ id: 'member-2' });

      await service.removeBoardMember('board-1', 'member-2', 'admin-1');

      expect(prisma.boardMember.delete).toHaveBeenCalledWith({ where: { id: 'member-2' } });
      expect(notifications.createAndDispatchNotifications).toHaveBeenCalledWith(['user-2'], {
        kind: 'board',
        boardId: 'board-1',
        title: 'Доступ к борде отозван',
        message: 'Ваш доступ к борде был удален',
      });
    });
  });

  describe('BoardNotificationsService', () => {
    it('deduplicates recipients, persists notifications, and emits realtime payloads', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const realtime = createRealtimeMock();
      const service = new BoardNotificationsService(prisma as never, realtime as never, access as never);
      const createdAt = new Date('2026-04-01T10:00:00.000Z');

      prisma.notification.create.mockResolvedValue({
        id: 'notif-1',
        kind: 'board',
        boardId: 'board-1',
        ticketId: null,
        title: 'Board updated',
        message: 'Settings changed',
        isRead: false,
        createdAt,
      });
      prisma.notification.count.mockResolvedValue(3);

      await service.createAndDispatchNotifications(['user-1', 'user-1', ' ', 'user-2'], {
        kind: 'board',
        boardId: 'board-1',
        title: 'Board updated',
        message: 'Settings changed',
      });

      expect(prisma.notification.create).toHaveBeenCalledTimes(2);
      expect(realtime.emitNotificationToUsers).toHaveBeenNthCalledWith(1, ['user-1'], {
        id: 'notif-1',
        kind: 'board',
        boardId: 'board-1',
        ticketId: undefined,
        title: 'Board updated',
        message: 'Settings changed',
        isRead: false,
        createdAt: createdAt.toISOString(),
        unreadCount: 3,
      });
    });

    it('notifies only ticket viewers excluding the actor', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const realtime = createRealtimeMock();
      const service = new BoardNotificationsService(prisma as never, realtime as never, access as never);

      prisma.boardMember.findMany.mockResolvedValue([
        { userId: 'actor-1', role: BoardMemberRole.ADMIN, customRole: null },
        { userId: 'user-2', role: BoardMemberRole.MEMBER, customRole: { name: 'qa', permissions: ['view'] } },
        { userId: 'user-3', role: BoardMemberRole.VIEWER, customRole: null },
      ]);
      access.normalizeRolePermissions.mockImplementation((permissions) => permissions);
      access.canAccessTicket
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      const dispatchSpy = jest.spyOn(service, 'createAndDispatchNotifications').mockResolvedValue(undefined);

      await service.notifyTicketViewers('board-1', 'ticket-1', { view: ['member'] }, {
        actorUserId: 'actor-1',
        title: 'Ticket updated',
        message: 'Priority changed',
      });

      expect(dispatchSpy).toHaveBeenCalledWith(['user-2'], {
        kind: 'ticket',
        boardId: 'board-1',
        ticketId: 'ticket-1',
        title: 'Ticket updated',
        message: 'Priority changed',
      });
    });

    it('marks one notification as read and returns refreshed unread count', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const realtime = createRealtimeMock();
      const service = new BoardNotificationsService(prisma as never, realtime as never, access as never);

      prisma.notification.findFirst.mockResolvedValue({
        id: 'notif-1',
        kind: 'board',
        boardId: 'board-1',
        ticketId: null,
        title: 'Board updated',
        message: 'Settings changed',
        isRead: false,
        createdAt: new Date('2026-04-01T10:00:00.000Z'),
      });
      prisma.notification.update.mockResolvedValue({ id: 'notif-1' });
      prisma.notification.count.mockResolvedValue(1);

      const result = await service.markNotificationRead('notif-1', 'user-1');

      expect(prisma.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-1' },
        data: { isRead: true, readAt: expect.any(Date) },
      });
      expect(result).toEqual({ ok: true, unreadCount: 1 });
    });
  });

  describe('BoardRolesService', () => {
    it('creates a role with full permissions by default', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const service = new BoardRolesService(prisma as never, access as never, notifications as never);

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.ADMIN });
      access.canManageTicketAccess.mockReturnValue(true);
      prisma.boardRole.findFirst.mockResolvedValue(null);
      prisma.boardRole.create.mockResolvedValue({
        id: 'role-1',
        boardId: 'board-1',
        name: 'QA',
        permissions: ALL_TICKET_PERMISSIONS,
      });

      await service.createBoardRole('board-1', { name: 'QA' }, 'admin-1');

      expect(prisma.boardRole.create).toHaveBeenCalledWith({
        data: {
          boardId: 'board-1',
          name: 'QA',
          permissions: ALL_TICKET_PERMISSIONS,
        },
      });
    });

    it('rejects role updates that normalize to an empty permission set', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const service = new BoardRolesService(prisma as never, access as never, notifications as never);

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.ADMIN });
      access.canManageTicketAccess.mockReturnValue(true);
      access.normalizeRolePermissions.mockReturnValue([]);
      prisma.boardRole.findFirst.mockResolvedValue({ id: 'role-1', boardId: 'board-1', name: 'QA' });

      await expect(
        service.updateBoardRole('board-1', 'role-1', { permissions: ['bogus'] }, 'admin-1'),
      ).rejects.toThrow('role must include at least one valid permission');
    });
  });

  describe('BoardsService', () => {
    it('allows only the owner to delete a board', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const realtime = createRealtimeMock();
      const service = new BoardsService(
        prisma as never,
        realtime as never,
        access as never,
        notifications as never,
        {} as never,
        {} as never,
      );

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.ADMIN });

      await expect(service.deleteBoard('board-1', 'admin-1')).rejects.toThrow('only board owner can delete board');

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.OWNER });
      prisma.board.delete.mockResolvedValue({ id: 'board-1' });

      await service.deleteBoard('board-1', 'owner-1');

      expect(prisma.board.delete).toHaveBeenCalledWith({ where: { id: 'board-1' } });
    });
  });

  describe('BoardTicketsService', () => {
    it('rejects setting access policy on create for non-admin members', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const realtime = createRealtimeMock();
      const service = new BoardTicketsService(
        prisma as never,
        realtime as never,
        access as never,
        notifications as never,
      );

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.MEMBER });
      access.canManageTicketAccess.mockReturnValue(false);

      await expect(
        service.createTicket(
          'board-1',
          {
            title: 'Ticket',
            status: 'todo',
            type: 'task',
            accessPolicy: { view: ['member'] },
          },
          'user-1',
        ),
      ).rejects.toThrow('only OWNER or ADMIN can set ticket access policy');
    });

    it('rejects estimate updates when estimate permission is denied', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const realtime = createRealtimeMock();
      const service = new BoardTicketsService(
        prisma as never,
        realtime as never,
        access as never,
        notifications as never,
      );

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.MEMBER });
      access.canAccessTicket.mockReturnValue(true);
      access.canUseTicketPermission.mockReturnValue(false);
      prisma.ticket.findFirst.mockResolvedValue({
        id: 'ticket-1',
        status: 'todo',
        columnId: null,
        sortIndex: 0,
        accessPolicy: { estimate: ['member'] },
        estimateOriginalHours: 3,
        estimateSpentHours: 1,
        estimateRemainingHours: 2,
        storyPoints: 5,
      });

      await expect(
        service.updateTicket('board-1', 'ticket-1', { estimateSpentHours: 4 }, 'user-1'),
      ).rejects.toThrow('ticket estimate access denied');
    });

    it('rejects comments when comment permission is denied', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const realtime = createRealtimeMock();
      const service = new BoardTicketsService(
        prisma as never,
        realtime as never,
        access as never,
        notifications as never,
      );

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.MEMBER });
      access.canAccessTicket.mockReturnValue(true);
      access.canUseTicketPermission.mockReturnValue(false);
      prisma.ticket.findFirst.mockResolvedValue({
        id: 'ticket-1',
        accessPolicy: { comment: ['member'] },
      });

      await expect(
        service.createTicketComment('board-1', 'ticket-1', { body: 'Need changes' }, 'user-1'),
      ).rejects.toThrow('ticket comment access denied');
    });

    it('rejects reorder when edit permission is denied for one of the tickets', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const realtime = createRealtimeMock();
      const service = new BoardTicketsService(
        prisma as never,
        realtime as never,
        access as never,
        notifications as never,
      );

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.MEMBER });
      prisma.ticket.findMany.mockResolvedValue([
        { id: 'ticket-1', accessPolicy: { edit: ['member'] } },
        { id: 'ticket-2', accessPolicy: { edit: ['member'] } },
      ]);
      access.canUseTicketPermission
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(false);

      await expect(
        service.reorderTickets(
          'board-1',
          {
            items: [
              { id: 'ticket-1', status: 'todo', columnId: 'col-1', sortIndex: 0 },
              { id: 'ticket-2', status: 'todo', columnId: 'col-1', sortIndex: 1 },
            ],
          },
          'user-1',
        ),
      ).rejects.toThrow('ticket access denied');
    });

    it('rejects deletion when delete permission is denied', async () => {
      const prisma = createPrismaMock();
      const access = createAccessMock();
      const notifications = createNotificationsMock();
      const realtime = createRealtimeMock();
      const service = new BoardTicketsService(
        prisma as never,
        realtime as never,
        access as never,
        notifications as never,
      );

      access.ensureBoardMembership.mockResolvedValue({ role: BoardMemberRole.MEMBER });
      access.canUseTicketPermission.mockReturnValue(false);
      prisma.ticket.findFirst.mockResolvedValue({
        id: 'ticket-1',
        accessPolicy: { delete: ['owner'] },
      });

      await expect(service.deleteTicket('board-1', 'ticket-1', 'user-1')).rejects.toThrow(
        'ticket delete access denied',
      );

      expect(prisma.ticket.delete).not.toHaveBeenCalled();
    });
  });
});