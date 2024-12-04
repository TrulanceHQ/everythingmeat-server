import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './auth.dto';

@Controller('auth')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() userDto: CreateUserDto) {
    return this.authService.create(userDto);
  }

  @Post('login')
  async login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto.emailAddress, userDto.password);
  }
  @Get()
  async findAll() {
    return this.authService.findAll();
  }
}
