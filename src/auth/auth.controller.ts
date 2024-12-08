import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { AuthService, LoginResponse } from './auth.service';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import { LocalAuthGuard } from '../utils/LocalGuard/local-auth.guard';
import { RolesGuard } from '../utils/Roles/roles.guard';
import { Roles } from '../utils/Roles/roles.decorator';

@Controller('api/v1')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async create(@Body() userDto: CreateUserDto) {
    return this.authService.create(userDto);
  }
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() userDto: LoginUserDto): Promise<LoginResponse> {
    return this.authService.login(userDto.emailAddress, userDto.password);
  }

  @Roles('admin')
  @Get('/user')
  async findAll() {
    return this.authService.findAll();
  }
}
