// src/seller/dto/update-seller.dto.ts
import { IsOptional, IsString, IsEmail, IsEnum } from 'class-validator';
import { UserRole, Gender } from '../../auth/schema/user.schema';

export class SellerDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  emailAddress?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}
