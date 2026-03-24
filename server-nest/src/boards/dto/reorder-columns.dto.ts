import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderColumnsDto {
  @ApiProperty({
    type: [String],
    example: ['col_todo', 'col_progress', 'col_done'],
  })
  @IsArray()
  @IsString({ each: true })
  columnIds: string[];
}
