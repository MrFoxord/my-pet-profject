import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateBoardRoleDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];
}
