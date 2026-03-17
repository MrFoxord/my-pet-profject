import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  status: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  columnId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessibilityRoles?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  accessibilityIds?: string[];
}
