import { IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty({ example: 'Implement OAuth callback' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Handle provider token exchange and session creation' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'todo' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'task' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'high' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: 'col_todo' })
  @IsOptional()
  @IsString()
  columnId?: string;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true,
    example: {
      view: ['owner', 'admin', 'member'],
      fill: ['owner', 'admin'],
      edit: ['owner', 'admin'],
      delete: ['owner'],
      estimate: ['owner', 'admin'],
      comment: ['owner', 'admin', 'member'],
      manageAccess: ['owner'],
    },
  })
  @IsOptional()
  @IsObject()
  accessPolicy?: {
    view?: string[];
    fill?: string[];
    edit?: string[];
    delete?: string[];
    estimate?: string[];
    comment?: string[];
    manageAccess?: string[];
  };

  @ApiPropertyOptional({ example: 8, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimateOriginalHours?: number | null;

  @ApiPropertyOptional({ example: 3, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimateSpentHours?: number | null;

  @ApiPropertyOptional({ example: 5, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimateRemainingHours?: number | null;

  @ApiPropertyOptional({ example: 5, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  storyPoints?: number | null;
}
