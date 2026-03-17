import { IsEnum } from 'class-validator';
import { BoardMemberRole } from '../../generated/prisma/client';

export class UpdateBoardMemberRoleDto {
  @IsEnum(BoardMemberRole)
  role: BoardMemberRole;
}
