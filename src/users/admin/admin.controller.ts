import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from './../../utils/Roles/roles.guard';
import { Roles } from './../../utils/Roles/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

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
}
