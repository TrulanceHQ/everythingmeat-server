import {
  Controller,
  Patch,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SellerService } from './seller.service';
import { SellerDto } from './seller.dto';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../utils/Roles/roles.guard';
import { Roles } from 'src/utils/Roles/roles.decorator';

@Controller('api/v1/seller')
@ApiTags('Sellers')
@UseGuards(RolesGuard)
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}
  @Roles('seller')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateSeller(
    @Param('id') id: string,
    @Body() sellerDto: SellerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.sellerService.updateSeller(id, sellerDto, file);
  }
}
