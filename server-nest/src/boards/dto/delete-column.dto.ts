import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class DeleteColumnDto {
  @ApiPropertyOptional({
    type: [String],
    example: ['ticket_1', 'ticket_2'],
    description: 'Optional ticket IDs expected in this column before deletion',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ticketIds?: string[];
}
