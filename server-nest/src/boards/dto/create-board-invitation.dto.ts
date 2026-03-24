import { IsEmail, IsEnum, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InvitationType } from '../../generated/prisma/client';

export enum SharedInvitationMode {
  SINGLE_USE = 'SINGLE_USE',
  MULTI_USE = 'MULTI_USE',
}

export class CreateBoardInvitationDto {
  @ApiProperty({ enum: InvitationType, example: InvitationType.PERSONAL })
  @IsEnum(InvitationType)
  type: InvitationType;

  @ApiPropertyOptional({
    example: 'user@example.com',
    description: 'Required when type is PERSONAL',
  })
  @ValidateIf((dto: CreateBoardInvitationDto) => dto.type === InvitationType.PERSONAL)
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'role_123' })
  @IsOptional()
  @IsString()
  customRoleId?: string;

  @ApiPropertyOptional({
    enum: SharedInvitationMode,
    example: SharedInvitationMode.SINGLE_USE,
    description: 'Required when type is SHARED',
  })
  @ValidateIf((dto: CreateBoardInvitationDto) => dto.type === InvitationType.SHARED)
  @IsEnum(SharedInvitationMode)
  sharedInvitationMode?: SharedInvitationMode;
}
