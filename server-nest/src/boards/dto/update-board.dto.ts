import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SharedInvitationMode } from './create-board-invitation.dto';

export class UpdateBoardDto {
  @ApiPropertyOptional({ example: 'Product roadmap' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Main planning board for Q2', nullable: true })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ example: '#173464', nullable: true })
  @IsOptional()
  @IsString()
  themeColor?: string | null;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/logo.png', nullable: true })
  @IsOptional()
  @IsString()
  logoUrl?: string | null;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  allowPersonalInvites?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  allowSharedInvites?: boolean;

  @ApiPropertyOptional({
    enum: SharedInvitationMode,
    example: SharedInvitationMode.SINGLE_USE,
  })
  @IsOptional()
  @IsEnum(SharedInvitationMode)
  defaultSharedInvitationMode?: SharedInvitationMode;

  @ApiPropertyOptional({ example: 168 })
  @IsOptional()
  @IsInt()
  @Min(1)
  inviteExpiresHours?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  sharedInviteMaxUses?: number;
}