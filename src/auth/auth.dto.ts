import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from './schema/user.schema';

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsEnum,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { UserRole } from './schema/user.schema';

export class CreateUserDto {
  @ApiProperty({ description: 'First name of the user', example: 'Test' })
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty({ description: 'Last name of the user', example: 'Code' })
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'testcode@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly emailAddress: string;

  @ApiProperty({
    description:
      'Password with at least one letter, one number, and one special character',
    example: 'Passw0rd!',
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  readonly password: string;

  @ApiProperty({ enum: UserRole, description: 'Role of the user' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  readonly role: UserRole;
}

export class ResendEmailDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'testcode@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  readonly emailAddress: string;
}

export class LoginUserDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'testcode@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  readonly emailAddress: string;

  @ApiProperty({
    description:
      'Password with at least one letter, one number, and one special character',
    example: 'Passw0rd!',
  })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class UpdateUserStatusDto {
  @ApiProperty({
    example: true,
    description: 'Indicates whether the user account is active',
  })
  @IsBoolean()
  isActive: boolean;
}

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Enter the email address to verify',
  })
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty({
    description: 'Enter the verification code sent to the email address',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Enter the your email address',
  })
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Enter the your email address',
  })
  @IsEmail()
  @IsNotEmpty()
  emailAddress: string;

  @ApiProperty({
    description: 'Enter the reset code sent to the email address',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description:
      'Password with at least one letter, one number, and one special character',
    example: 'Passw0rd!',
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  newPassword: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Profile image URL of the user',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'testcode@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  emailAddress?: string;

  @ApiProperty({
    description: 'Primary phone number of the user',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber1?: string;

  @ApiPropertyOptional({
    description: 'Secondary phone number of the user',
    example: '+0987654321',
  })
  @IsOptional()
  @IsString()
  phoneNumber2?: string;

  @ApiProperty({ enum: UserRole, description: 'Role of the user' })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role?: UserRole;

  @ApiProperty({
    description: 'Gender of the user',
    enum: Gender,
    example: Gender.MALE,
  })
  @IsNotEmpty()
  @IsEnum(Gender)
  gender?: Gender;
}

export class ChangePasswordDto {
  @ApiProperty({
    description:
      'Old password of the user. Password with at least one letter, one number, and one special character',
    example: 'oldPassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  oldPassword: string;

  @ApiProperty({
    description:
      'New password of the user. Password with at least one letter, one number, and one special character',
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message:
      'Password must contain at least one letter, one number, and one special character',
  })
  newPassword: string;
}
