import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ReorderTicketItemDto {
  @ApiProperty({ example: 'ticket_1' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'in-progress' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ example: 'col_progress' })
  @IsOptional()
  @IsString()
  columnId?: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(0)
  sortIndex: number;
}

export class ReorderTicketsDto {
  @ApiProperty({
    type: [ReorderTicketItemDto],
    example: [
      { id: 'ticket_1', status: 'todo', columnId: 'col_todo', sortIndex: 0 },
      { id: 'ticket_2', status: 'in-progress', columnId: 'col_progress', sortIndex: 1 },
    ],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderTicketItemDto)
  items: ReorderTicketItemDto[];
}
