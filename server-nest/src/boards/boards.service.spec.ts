import { BoardMemberRole, InvitationType } from '../generated/prisma/client';
import { BoardInvitationsService } from './board-invitations.service';
import { BoardsAccessService } from './boards-access.service';

describe('Board helper services', () => {
  const prismaMock = {} as never;
  const notificationsMock = {
    notifyBoardMembers: jest.fn(),
  } as never;

  const accessService = new BoardsAccessService(prismaMock);
  const invitationsService = new BoardInvitationsService(
    prismaMock,
    accessService,
    notificationsMock,
  );

  it('returns pending invitation state for active pending invitation', () => {
    const state = invitationsService.getInvitationState({
      type: InvitationType.PERSONAL,
      status: 'pending',
      expiresAt: new Date(Date.now() + 60_000),
      usedCount: 0,
      maxUses: 1,
    });

    expect(state).toBe('pending');
  });

  it('returns limit_reached for shared invitation when max uses consumed', () => {
    const state = invitationsService.getInvitationState({
      type: InvitationType.SHARED,
      status: 'pending',
      expiresAt: new Date(Date.now() + 60_000),
      usedCount: 5,
      maxUses: 5,
    });

    expect(state).toBe('limit_reached');
  });

  it('allows owner to manage access regardless of access policy', () => {
    const canManage = accessService.canUseTicketPermission(
      { manageAccess: ['custom_role'] },
      { role: BoardMemberRole.OWNER, customRoleName: null, customRolePermissions: [] },
      'manageAccess',
    );

    expect(canManage).toBe(true);
  });

  it('denies viewer edit when policy only allows admin', () => {
    const canEdit = accessService.canUseTicketPermission(
      { edit: ['admin'] },
      { role: BoardMemberRole.VIEWER, customRoleName: null, customRolePermissions: [] },
      'edit',
    );

    expect(canEdit).toBe(false);
  });
});
