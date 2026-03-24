import { InvitationType } from '../../generated/prisma/client';
export declare enum SharedInvitationMode {
    SINGLE_USE = "SINGLE_USE",
    MULTI_USE = "MULTI_USE"
}
export declare class CreateBoardInvitationDto {
    type: InvitationType;
    email?: string;
    customRoleId?: string;
    sharedInvitationMode?: SharedInvitationMode;
}
