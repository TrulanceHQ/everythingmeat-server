import {
  Controller,
  Patch,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { SellerService } from './seller.service';
import { SellerDto } from './seller.dto';
import { RolesGuard } from '../../utils/Roles/roles.guard';
import { Roles } from 'src/utils/Roles/roles.decorator';

@Controller('api/v1/seller')
@ApiTags('Sellers')
@ApiBearerAuth() // Enables Bearer Token in Swagger UI
@UseGuards(RolesGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}
  @Roles('seller')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Update seller details' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'Seller ID',
    required: true,
  })
  @ApiBody({
    description: 'Seller data to update',
    type: SellerDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Seller successfully updated',
    type: SellerDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Seller not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or request',
  })
  async updateSeller(
    @Param('id') id: string,
    @Body() sellerDto: SellerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('Uploaded File:', file);
    return this.sellerService.updateSeller(id, sellerDto, file);
  }
}
