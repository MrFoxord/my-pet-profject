import { IsObject, IsOptional, IsString, IsArray } from 'class-validator';

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
  @IsObject()
  accessPolicy?: {
    view?: string[];
    edit?: string[];
    delete?: string[];
    estimate?: string[];
    comment?: string[];
    manageAccess?: string[];
  };
}
