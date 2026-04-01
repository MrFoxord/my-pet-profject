import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TICKET_PRIORITY_VALUES, TICKET_STATUS_VALUES, TICKET_TYPE_VALUES } from '../boards.constants';
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
  @IsIn(TICKET_STATUS_VALUES)
  status: TicketStatus;

  @ApiProperty({ example: 'task' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @IsIn(TICKET_TYPE_VALUES)
  type: TicketType;

  @ApiPropertyOptional({ example: 'high' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @IsIn(TICKET_PRIORITY_VALUES)
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
