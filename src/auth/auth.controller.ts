import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { AuthService, LoginResponse } from './auth.service';
import {
  ChangePasswordDto,
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  ResendVerificationCodeDto,
  ResetPasswordDto,
  UpdateUserDto,
  VerifyEmailDto,
  //VerifyEmailDto,
} from './auth.dto';
import { LocalAuthGuard } from '../utils/LocalGuard/local-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../utils/Roles/roles.guard';
import { Roles } from '../utils/Roles/roles.decorator';
import { VerifiedUserGuard } from 'src/utils/verifiredUserGuard/verified-user.guard';

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

  @Post('/resend-verification-code')
  @ApiOperation({ summary: 'Resend Verification Code' })
  @ApiBody({ type: ResendVerificationCodeDto })
  @ApiResponse({
    status: 200,
    description: 'Verification code resent successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'User is already verified' })
  async resendVerificationCode(
    @Body() resendVerificationCodeDto: ResendVerificationCodeDto,
  ) {
    const { emailAddress } = resendVerificationCodeDto;
    return this.authService.resendVerificationCode(emailAddress);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard, VerifiedUserGuard)
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

  @Roles('admin', 'seller', 'buyer')
  @UseGuards(VerifiedUserGuard)
  @Patch('/update-user/:id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update user details' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'User details updated successfully',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.authService.updateUser(id, updateUserDto, file);
  }

  @Roles('admin', 'seller', 'buyer')
  @UseGuards(VerifiedUserGuard)
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

  @Roles('admin', 'seller', 'buyer')
  @UseGuards(VerifiedUserGuard)
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

  @Roles('admin', 'seller', 'buyer')
  @UseGuards(VerifiedUserGuard)
  @Patch('/change-password/:id')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Old password is incorrect',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.updatePassword(id, changePasswordDto);
  }
  @Roles('admin')
  @UseGuards(VerifiedUserGuard)
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
