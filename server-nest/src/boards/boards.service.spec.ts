import { BoardMemberRole, InvitationType } from '../generated/prisma/client';
import { BoardsService } from './boards.service';

describe('BoardsService permission and invitation logic', () => {
  const prismaMock = {} as never;
  const realtimeMock = {
    emitNotificationToUsers: jest.fn(),
    emitBoardStateChanged: jest.fn(),
    emitTicketStateChanged: jest.fn(),
  } as never;

  const service = new BoardsService(prismaMock, realtimeMock);
  const serviceInternals = service as unknown as {
    getInvitationState: (invitation: {
      type: InvitationType;
      status: string;
      expiresAt: Date;
      usedCount: number;
      maxUses: number;
    }) => string;
    canUseTicketPermission: (
      accessPolicy: Partial<Record<'view' | 'fill' | 'edit' | 'delete' | 'estimate' | 'comment' | 'manageAccess', string[]>>,
      membership: { role: BoardMemberRole; customRoleName: string | null },
      permission: 'view' | 'fill' | 'edit' | 'delete' | 'estimate' | 'comment' | 'manageAccess',
    ) => boolean;
  };

  it('returns pending invitation state for active pending invitation', () => {
    const state = serviceInternals.getInvitationState({
      type: InvitationType.PERSONAL,
      status: 'pending',
      expiresAt: new Date(Date.now() + 60_000),
      usedCount: 0,
      maxUses: 1,
    });

    expect(state).toBe('pending');
  });

  it('returns limit_reached for shared invitation when max uses consumed', () => {
    const state = serviceInternals.getInvitationState({
      type: InvitationType.SHARED,
      status: 'pending',
      expiresAt: new Date(Date.now() + 60_000),
      usedCount: 5,
      maxUses: 5,
    });

    expect(state).toBe('limit_reached');
  });

  it('allows owner to manage access regardless of access policy', () => {
    const canManage = serviceInternals.canUseTicketPermission(
      { manageAccess: ['custom_role'] },
      { role: BoardMemberRole.OWNER, customRoleName: null },
      'manageAccess',
    );

    expect(canManage).toBe(true);
  });

  it('denies viewer edit when policy only allows admin', () => {
    const canEdit = serviceInternals.canUseTicketPermission(
      { edit: ['admin'] },
      { role: BoardMemberRole.VIEWER, customRoleName: null },
      'edit',
    );

    expect(canEdit).toBe(false);
  });
});
