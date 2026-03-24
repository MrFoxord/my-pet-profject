import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBoardMemberCustomRoleDto {
  @ApiPropertyOptional({
    nullable: true,
    example: 'role_123',
    description: 'Set null or omit to clear custom role',
  })
  @IsOptional()
  @IsString()
  customRoleId?: string | null;
}
