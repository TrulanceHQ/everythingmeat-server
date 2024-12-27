import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CloudinaryService } from '../utils/cloudinary/cloudinary.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createProduct(
    sellerId: string,
    createProductDto: CreateProductDto,
    healthSatisfactionImage?: Express.Multer.File,
    productImages?: Express.Multer.File[],
  ): Promise<Product> {
    // Upload health satisfaction image
    const healthSatisfactionImageUrl = healthSatisfactionImage
      ? await this.cloudinaryService.uploadImage(
          healthSatisfactionImage,
          'health-safety',
        )
      : null;

    // Upload product images
    const productImagesUrls = productImages?.length
      ? await this.cloudinaryService.uploadImages(
          productImages,
          'product-images',
        )
      : [];

    // Create and save the new product
    const newProduct = new this.productModel({
      ...createProductDto,
      healthSatisfactionImage: healthSatisfactionImageUrl,
      productImages: productImagesUrls,
      sellerId,
    });

    return newProduct.save();
  }

  async updateProduct(
    productId: string,
    sellerId: string,
    updateProductDto: UpdateProductDto,
    healthSatisfactionImage?: Express.Multer.File,
    productImages?: Express.Multer.File[],
  ): Promise<Product> {
    // Find a product
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    // Upload health satisfaction image
    if (healthSatisfactionImage) {
      updateProductDto.healthSatisfactionImage =
        await this.cloudinaryService.uploadImage(
          healthSatisfactionImage,
          'health-safety',
        );
    }

    // Upload product images
    if (productImages?.length) {
      updateProductDto.productImages =
        await this.cloudinaryService.uploadImages(
          productImages,
          'product-images',
        );
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      {
        ...product.toObject(),
        ...updateProductDto,
        sellerId,
      },
      { new: true },
    );

    return updatedProduct;
  }
}
