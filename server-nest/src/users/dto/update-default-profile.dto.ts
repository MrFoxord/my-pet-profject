import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const WORK_ROLES = ['CLIENT', 'EXECUTOR', 'ORGANIZER', 'CEO'] as const;

export class UpdateDefaultProfileDto {
  @ApiProperty({ example: 'John', minLength: 1, maxLength: 80 })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName: string;

  @ApiProperty({ example: 'Doe', minLength: 1, maxLength: 80 })
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName: string;

  @ApiPropertyOptional({ example: 'johndoe', minLength: 2, maxLength: 30 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  nickname?: string;

  @ApiProperty({
    enum: WORK_ROLES,
    example: 'CLIENT',
  })
  @IsString()
  @IsIn(WORK_ROLES)
  workRole: (typeof WORK_ROLES)[number];
}
