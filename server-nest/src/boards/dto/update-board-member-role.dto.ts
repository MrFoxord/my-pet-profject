import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BoardMemberRole } from '../../generated/prisma/client';

export class UpdateBoardMemberRoleDto {
  @ApiProperty({ enum: BoardMemberRole, example: BoardMemberRole.MEMBER })
  @IsEnum(BoardMemberRole)
  role: BoardMemberRole;
}
