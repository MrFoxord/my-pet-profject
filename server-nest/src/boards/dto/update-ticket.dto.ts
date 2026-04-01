import { Transform } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, IsObject, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TICKET_PRIORITY_VALUES, TICKET_STATUS_VALUES, TICKET_TYPE_VALUES } from '../boards.constants';
import { TicketPriority, TicketStatus, TicketType } from '../../shared/tickets';

export class UpdateTicketDto {
  @ApiPropertyOptional({ example: 'Refine webhook retries' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Need exponential backoff and idempotency key.' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'done' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @IsIn(TICKET_STATUS_VALUES)
  status?: TicketStatus;

  @ApiPropertyOptional({ example: 'bug' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @IsIn(TICKET_TYPE_VALUES)
  type?: TicketType;

  @ApiPropertyOptional({ example: 'critical' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsString()
  @IsIn(TICKET_PRIORITY_VALUES)
  priority?: TicketPriority;

  @ApiPropertyOptional({ example: 'col_done' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  columnId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortIndex?: number;

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
    fill?: string[];
    view?: string[];
    edit?: string[];
    delete?: string[];
    estimate?: string[];
    comment?: string[];
    manageAccess?: string[];
  };

  @ApiPropertyOptional({ example: 10, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimateOriginalHours?: number | null;

  @ApiPropertyOptional({ example: 6, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimateSpentHours?: number | null;

  @ApiPropertyOptional({ example: 4, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  estimateRemainingHours?: number | null;

  @ApiPropertyOptional({ example: 8, nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  storyPoints?: number | null;
}
