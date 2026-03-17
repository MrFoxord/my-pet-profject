import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderTicketItemDto {
  @IsString()
  id: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  columnId?: string;

  @IsInt()
  @Min(0)
  sortIndex: number;
}

export class ReorderTicketsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderTicketItemDto)
  items: ReorderTicketItemDto[];
}
