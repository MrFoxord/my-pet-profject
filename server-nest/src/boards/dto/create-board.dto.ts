import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBoardDto {
  @ApiProperty({ example: 'Product roadmap' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Main planning board for Q2' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '#173464' })
  @IsOptional()
  @IsString()
  themeColor?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png' })
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional({ type: [String], example: ['To Do', 'In Progress', 'Done'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  columns?: string[];

  @ApiPropertyOptional({ type: [String], example: ['Design', 'QA', 'Support'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customRoles?: string[];

  @ApiPropertyOptional({ example: 'Injected from JWT in controller' })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiPropertyOptional({ example: 'OWNER' })
  @IsOptional()
  @IsString()
  dashboardRole?: string;
}
