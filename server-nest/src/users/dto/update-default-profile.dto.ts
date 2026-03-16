import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

const WORK_ROLES = ['CLIENT', 'EXECUTOR', 'ORGANIZER', 'CEO'] as const;

export class UpdateDefaultProfileDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(80)
  lastName: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  nickname?: string;

  @IsString()
  @IsIn(WORK_ROLES)
  workRole: (typeof WORK_ROLES)[number];
}
