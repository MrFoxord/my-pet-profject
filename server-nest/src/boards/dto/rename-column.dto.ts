import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RenameColumnDto {
  @ApiProperty({ example: 'Ready for QA' })
  @IsString()
  title: string;
}
