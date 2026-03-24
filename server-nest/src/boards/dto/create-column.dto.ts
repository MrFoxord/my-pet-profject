import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateColumnDto {
  @ApiProperty({ example: 'Blocked' })
  @IsString()
  title: string;
}