import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  columnId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortIndex?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessibilityRoles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessibilityIds?: string[];
}
