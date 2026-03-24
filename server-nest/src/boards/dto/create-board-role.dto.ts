import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBoardRoleDto {
  @ApiProperty({ example: 'Support Engineer' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['tickets:view', 'tickets:comment'],
  })
  @IsArray()
  @IsOptional()
  permissions?: string[];
}
