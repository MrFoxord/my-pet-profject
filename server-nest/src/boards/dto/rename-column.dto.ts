import { IsString } from 'class-validator';

export class RenameColumnDto {
  @IsString()
  title: string;
}
