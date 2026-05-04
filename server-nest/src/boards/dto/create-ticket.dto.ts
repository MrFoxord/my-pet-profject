import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketPriority, TicketStatus, TicketType } from '../../shared/tickets';

export class CreateTicketDto {
  @ApiProperty({ example: 'Implement OAuth callback' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Handle provider token exchange and session creation' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  description?: string;

  @ApiProperty({ example: 'todo' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @IsEnum(TicketStatus)
  status: TicketStatus;

  @ApiProperty({ example: 'task' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @IsEnum(TicketType)
  type: TicketType;

  @ApiPropertyOptional({ example: 'high' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({ example: 'col_todo' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
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
