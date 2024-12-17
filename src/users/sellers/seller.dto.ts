// src/seller/dto/update-seller.dto.ts
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Gender } from '../../auth/schema/user.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SellerDto {
  @ApiPropertyOptional({
    description: 'First name of the seller',
    example: 'John',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Last name of the seller',
    example: 'Doe',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Profile image URL of the seller',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiPropertyOptional({
    description: 'Gender of the seller',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @ApiPropertyOptional({
    description: 'Primary phone number of the seller',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phoneNumber1?: string;

  @ApiPropertyOptional({
    description: 'Secondary phone number of the seller',
    example: '+0987654321',
  })
  @IsOptional()
  @IsString()
  phoneNumber2?: string;
}
