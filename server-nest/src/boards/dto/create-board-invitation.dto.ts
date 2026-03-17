import { IsEmail, IsEnum } from 'class-validator';
import { BoardMemberRole } from '../../generated/prisma/client';

export class CreateBoardInvitationDto {
  @IsEmail()
  email: string;

  @IsEnum(BoardMemberRole)
  role: BoardMemberRole;
}
