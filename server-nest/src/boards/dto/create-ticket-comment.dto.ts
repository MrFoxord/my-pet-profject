import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketCommentDto {
  @ApiProperty({ example: 'Looks good, but we need to update acceptance criteria.' })
  @IsString()
  body: string;
}