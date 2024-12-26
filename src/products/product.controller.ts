import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './product.dto';
import { ProductService } from './product.service';
import { RolesGuard } from '../utils/Roles/roles.guard';
import { Roles } from '../utils/Roles/roles.decorator';
// import { send } from 'process';

@Controller('api/v1/products')
@ApiTags('Sellers')
@UseGuards(RolesGuard)
@ApiBearerAuth() // Enables Bearer Token in Swagger UI
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @Roles('seller')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data to create',
    type: CreateProductDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Product successfully created',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or request',
  })
  @UseInterceptors(
    AnyFilesInterceptor({
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB file size limit
      },
      fileFilter: (req, file, cb) => {
        // Allowed file types
        const allowedMimesTypes = [
          'image/jpeg',
          'image/png',
          'image/jpg',
          'image/webp',
        ];
        if (allowedMimesTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              `Invalid file type. Only JPEG, PNG, JPG, and WEBP image files are allowed.`,
            ),
            false,
          );
        }
      },
    }),
  )
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Request() req,
  ) {
    // Separate files based on field name
    const healthSatisfactionImage = files.find(
      (file) => file.fieldname === 'healthSatisfactionImage',
    );
    const productImages = files.filter(
      (file) => file.fieldname === 'productImages',
    );

    // console.log('req.user', req.user);
    const sellerId = req.user.sub;
    // console.log('sellerId', sellerId);
    return this.productService.createProduct(
      sellerId,
      createProductDto,
      healthSatisfactionImage,
      productImages,
    );
  }
}
