// import {
//   IsEmail,
//   IsNotEmpty,
//   IsString,
//   Matches,
//   MinLength,
//   IsEnum,
// } from 'class-validator';
// import { UserRole } from './schema/user.schema';

// export class CreateUserDto {
//   @IsString()
//   @IsNotEmpty()
//   readonly firstName: string;

//   @IsString()
//   @IsNotEmpty()
//   readonly lastName: string;

//   @IsNotEmpty()
//   @IsEmail()
//   readonly emailAddress: string;

//   @IsString()
//   @MinLength(6)
//   @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
//     message:
//       'Password must contain at least one letter, one number, and one special character',
//   })
//   readonly password: string;

//   @IsEnum(UserRole)
//   @IsNotEmpty()
//   readonly role: UserRole;
// }
// export class LoginUserDto {
//   @IsNotEmpty()
//   @IsEmail()
//   readonly emailAddress: string;

//   @IsString()
//   @IsNotEmpty()
//   @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
//     message:
//       'Password must contain at least one letter, one number, and one special character',
//   })
//   readonly password: string;
// }

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
  IsEnum,
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
