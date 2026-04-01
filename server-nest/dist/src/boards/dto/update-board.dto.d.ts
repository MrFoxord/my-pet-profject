import { SharedInvitationMode } from './create-board-invitation.dto';
export declare class UpdateBoardDto {
    title?: string;
    description?: string | null;
    themeColor?: string | null;
    logoUrl?: string | null;
    allowPersonalInvites?: boolean;
    allowSharedInvites?: boolean;
    defaultSharedInvitationMode?: SharedInvitationMode;
    inviteExpiresHours?: number;
    sharedInviteMaxUses?: number;
}
