import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './product.dto';
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
    createProductDto: CreateProductDto,
    healthSatisfactionImage?: Express.Multer.File,
    productImages?: Express.Multer.File[],
    createdBy?: string,
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
      createdBy,
    });

    return newProduct.save();
  }
}
