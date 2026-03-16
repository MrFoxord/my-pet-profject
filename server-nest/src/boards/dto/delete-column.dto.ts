import { IsArray, IsOptional, IsString } from 'class-validator';

export class DeleteColumnDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ticketIds?: string[];
}
