import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
    console.log('updateProductDto', updateProductDto);
    const product = await this.productModel.findById(productId);
    console.log('product', product);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.sellerId.toString() !== sellerId) {
      throw new UnauthorizedException(
        'You are not authorized to update this product',
      );
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

    // Remove undefined or empty values from updateProductDto
    const filteredUpdates = Object.fromEntries(
      Object.entries(updateProductDto).filter(([_, value]) => {
        if (typeof value === 'number') return value !== 0; // Keep non-zero numbers
        return value !== undefined && value !== '';
      }),
    );

    const updatedFields = { ...product.toObject(), ...filteredUpdates };

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      { $set: updatedFields },
      { new: true },
    );

    console.log('updatedProduct', updatedProduct);
    return updatedProduct;
  }

  async getAllProducts(query: any): Promise<any> {
    const { page = 1, limit = 10 } = query;

    const totalProducts = await this.productModel.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages) {
      throw new BadRequestException(
        `Page ${page} exceeds total pages ${totalPages}.`,
      );
    }

    const products = await this.productModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit, 10))
      .exec();

    return {
      totalProducts,
      totalPages,
      currentPage: page,
      products,
    };
  }

  async getProductById(productId: string): Promise<Product> {
    const product = await this.productModel.findById(productId).exec();
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return product;
  }

  async getAllProductsBySeller(sellerId: string, query: any): Promise<any> {
    const { page = 1, limit = 20 } = query;

    const sellerExist = await this.productModel.exists({ sellerId });
    if (!sellerExist) {
      throw new BadRequestException('Seller not found');
    }

    const totalProducts = await this.productModel.countDocuments({
      sellerId: sellerId,
    });

    const totalPages = Math.ceil(totalProducts / limit);

    if (page > totalPages) {
      throw new BadRequestException(
        `Page ${page} exceeds total pages ${totalPages}.`,
      );
    }
    const products = await this.productModel
      .find({ sellerId })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      totalProducts,
      totalPages,
      currentPage: page,
      products,
    };
  }

  async deleteProduct(productId: string, sellerId: string): Promise<any> {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.sellerId.toString() !== sellerId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this product',
      );
    }

    await this.productModel.findByIdAndDelete(productId);
    return { message: 'Product successfully deleted' };
  }
}
