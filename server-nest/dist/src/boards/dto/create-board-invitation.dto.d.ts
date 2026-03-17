import { BoardMemberRole } from '../../generated/prisma/client';
export declare class CreateBoardInvitationDto {
    email: string;
    role: BoardMemberRole;
}
