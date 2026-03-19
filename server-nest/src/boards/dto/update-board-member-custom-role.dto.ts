import { IsOptional, IsString } from 'class-validator';

export class UpdateBoardMemberCustomRoleDto {
  @IsOptional()
  @IsString()
  customRoleId?: string | null;
}
