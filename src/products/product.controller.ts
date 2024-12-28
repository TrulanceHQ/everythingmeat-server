import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Request,
  BadRequestException,
  Patch,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { ProductService } from './product.service';
import { RolesGuard } from '../utils/Roles/roles.guard';
import { Roles } from '../utils/Roles/roles.decorator';

const allowedMimesTypes = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'image/webp',
  'application/pdf', // PDF files
  'application/msword', // DOC files
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX files
];

@Controller('api/v1/products')
@ApiTags('Sellers')
@UseGuards(RolesGuard)
@ApiBearerAuth()
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

    const sellerId = req.user.sub;
    return this.productService.createProduct(
      sellerId,
      createProductDto,
      healthSatisfactionImage,
      productImages,
    );
  }

  @Roles('seller')
  @Patch(':id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    required: true,
  })
  @ApiBody({
    description: 'Product data to update',
    type: UpdateProductDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Product successfully updated',
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
  async updateProduct(
    @Param('id') productId: string,
    @Body() updateProductDto: UpdateProductDto,
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

    const sellerId = req.user.sub;
    return this.productService.updateProduct(
      productId,
      sellerId,
      updateProductDto,
      healthSatisfactionImage,
      productImages,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched all products',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  async getAllProducts(@Query() query: any) {
    return this.productService.getAllProducts(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({
    name: 'id',
    description: 'Product ID',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the product',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  async getProductById(@Param('id') productId: string) {
    return this.productService.getProductById(productId);
  }

  @Get('seller/:sellerId')
  @ApiOperation({ summary: 'Get all products by a seller with pagination' })
  @ApiParam({
    name: 'sellerId',
    description: 'The ID of the seller',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched all products by the seller',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  async getAllProductsBySeller(
    @Param('sellerId') sellerId: string,
    @Query() query: any,
  ) {
    return this.productService.getAllProductsBySeller(sellerId, query);
  }
}
