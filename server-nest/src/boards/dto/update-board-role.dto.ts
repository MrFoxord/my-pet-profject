import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBoardRoleDto {
  @ApiPropertyOptional({ example: 'Senior Support Engineer' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['tickets:view', 'tickets:comment', 'tickets:estimate'],
  })
  @IsArray()
  @IsOptional()
  permissions?: string[];
}
