import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateBoardRoleDto {
  @IsString()
  name: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];
}
