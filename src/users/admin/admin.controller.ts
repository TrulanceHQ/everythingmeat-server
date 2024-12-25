import {
  Controller,
  Get,
  UseGuards,
  Param,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from './../../utils/Roles/roles.guard';
import { Roles } from './../../utils/Roles/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateUserStatusDto } from 'src/auth/auth.dto';

@ApiTags('Admin (Admin only)')
@ApiBearerAuth()
@Controller('api/v1/admin')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles('admin')
  @Get('seller')
  @ApiOperation({ summary: 'Get all sellers' })
  @ApiResponse({ status: 200, description: 'List of all sellers' })
  async getAllSellers() {
    return this.adminService.getAllSellers();
  }

  @Roles('admin')
  @Get('buyer')
  @ApiOperation({ summary: 'Get all buyers' })
  @ApiResponse({ status: 200, description: 'List of all buyers' })
  async getAllBuyers() {
    return this.adminService.getAllBuyers();
  }
  @Roles('admin')
  @Get('admin')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'List of all admins' })
  async getAllAdmins() {
    return this.adminService.getAllAdmins();
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
}
