/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  UseGuards,
  Param,
  Patch,
  Body,
  Delete,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from './../../utils/Roles/roles.guard';
import { Roles } from './../../utils/Roles/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdateUserStatusDto } from 'src/auth/auth.dto';

@ApiTags('Admin (Admin only)')
@ApiBearerAuth()
@Controller('api/v1/admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles('admin')
  @Get('sellers')
  @ApiOperation({ summary: 'Get all sellers' })
  @ApiResponse({ status: 200, description: 'List of all sellers' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'firstName', required: false, type: String })
  @ApiQuery({ name: 'lastName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  async getAllSellers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('email') email?: string,
  ) {
    const filter = { firstName, lastName, email };
    const cleanedFilter = Object.fromEntries(
      Object.entries(filter).filter(([_, v]) => v != null),
    );
    return this.adminService.getAllSellers(page, limit, cleanedFilter);
  }

  @Roles('admin')
  @Get('buyers')
  @ApiOperation({ summary: 'Get all buyers' })
  @ApiResponse({ status: 200, description: 'List of all buyers' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'firstName', required: false, type: String })
  @ApiQuery({ name: 'lastName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  async getAllBuyers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('email') email?: string,
  ) {
    const filter = { firstName, lastName, email };
    const cleanedFilter = Object.fromEntries(
      Object.entries(filter).filter(([_, v]) => v != null),
    );
    return this.adminService.getAllBuyers(page, limit, cleanedFilter);
  }
  @Roles('admin')
  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'List of all admins' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'firstName', required: false, type: String })
  @ApiQuery({ name: 'lastName', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  async getAllAdmins(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('email') email?: string,
  ) {
    const filter = { firstName, lastName, email };
    const cleanedFilter = Object.fromEntries(
      Object.entries(filter).filter(([_, v]) => v != null),
    );
    return this.adminService.getAllAdmins(page, limit, cleanedFilter);
  }

  @Roles('admin')
  @Get('user/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getOneUserById(@Param('id') userId: string) {
    return this.adminService.getOneUserById(userId);
  }

  @Roles('admin')
  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user status' })
  @ApiResponse({ status: 200, description: 'User status updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateUserStatus(
    @Param('id') userId: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    return this.adminService.updateUserStatus(
      userId,
      updateUserStatusDto.isActive,
    );
  }

  @Roles('admin')
  @Delete('user/:id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async deleteUser(@Param('id') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Roles('admin')
  @Get('count/sellers')
  @ApiOperation({ summary: 'Get total number of sellers' })
  @ApiResponse({ status: 200, description: 'Total number of sellers' })
  async countSellers() {
    const count = await this.adminService.countSellers();
    return { count };
  }

  @Roles('admin')
  @Get('count/buyers')
  @ApiOperation({ summary: 'Get total number of buyers' })
  @ApiResponse({ status: 200, description: 'Total number of buyers' })
  async countBuyers() {
    const count = await this.adminService.countBuyers();
    return { count };
  }
}
