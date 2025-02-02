// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   HttpCode,
//   UseGuards,
// } from '@nestjs/common';
// import { AuthService, LoginResponse } from './auth.service';
// import { CreateUserDto, LoginUserDto } from './auth.dto';
// import { LocalAuthGuard } from '../utils/LocalGuard/local-auth.guard';
// import { RolesGuard } from '../utils/Roles/roles.guard';
// import { Roles } from '../utils/Roles/roles.decorator';

// @Controller('api/v1')
// @UseGuards(RolesGuard)
// export class UsersController {
//   constructor(private readonly authService: AuthService) {}

//   @Post('/register')
//   async create(@Body() userDto: CreateUserDto) {
//     return this.authService.create(userDto);
//   }
//   @HttpCode(200)
//   @UseGuards(LocalAuthGuard)
//   @Post('/login')
//   async login(@Body() userDto: LoginUserDto): Promise<LoginResponse> {
//     return this.authService.login(userDto.emailAddress, userDto.password);
//   }

//   @Roles('admin')
//   @Get('/user')
//   async findAll() {
//     return this.authService.findAll();
//   }
// }

import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService, LoginResponse } from './auth.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './auth.dto';
import { LocalAuthGuard } from '../utils/LocalGuard/local-auth.guard';
import { RolesGuard } from '../utils/Roles/roles.guard';
import { Roles } from '../utils/Roles/roles.decorator';

@ApiTags('Auth')
@ApiBearerAuth()
@Controller('api/v1')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 409, description: 'Conflict: Email already exists' })
  async create(@Body() userDto: CreateUserDto) {
    return this.authService.create(userDto);
  }

  @Post('/verify-email')
  @ApiOperation({ summary: 'Verify New User Email' })
  @ApiBody({ type: VerifyEmailDto })
  @ApiResponse({ status: 200, description: 'Email verified successfully' })
  @ApiResponse({
    status: 400,
    description: 'Invalid or expired verification code',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid credentials',
  })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    const { emailAddress, code } = verifyEmailDto;
    await this.authService.verifyEmail(emailAddress, code);
    return { message: 'Email verified successfully' };
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid credentials',
  })
  async login(@Body() userDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.login(userDto.emailAddress, userDto.password);
  }

  @Post('/forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Reset code sent to email' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { emailAddress } = forgotPasswordDto;
    await this.authService.forgotPassword(emailAddress);
    return { message: 'Reset code sent to email' };
  }

  @Post('/reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset code' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { emailAddress, code, newPassword } = resetPasswordDto;
    await this.authService.resetPassword(emailAddress, code, newPassword);
    return { message: 'Password reset successfully' };
  }

  @Roles('admin', 'buyer')
  @Get('/user')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [CreateUserDto],
  })
  async findAll() {
    return this.authService.findAll();
  }
}
