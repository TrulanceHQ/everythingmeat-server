import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../auth/schema/user.schema';
import { SellerDto } from './seller.dto';
import { CloudinaryService } from '../../utils/cloudinary/cloudinary.service';

@Injectable()
export class SellerService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async updateSeller(
    id: string,
    sellerDto: SellerDto,
    file?: Express.Multer.File,
  ): Promise<User> {
    if (file) {
      const imageUrl = await this.cloudinaryService.uploadImage(
        file,
        'sellers',
      );
      sellerDto.image = imageUrl;
    }

    // Filter out undefined, null, or empty values
    const filteredUpdates = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(sellerDto).filter(([_, v]) => v !== undefined && v !== ''),
    );

    const updatedSeller = await this.userModel.findByIdAndUpdate(
      id,
      { $set: filteredUpdates },
      { new: true },
    );

    if (!updatedSeller) {
      throw new NotFoundException('Seller not found');
    }

    return updatedSeller;
  }

  async getSeller(id: string): Promise<User> {
    const seller = await this.userModel.findById(id);

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return seller;
  }

  async deleteSeller(id: string): Promise<User> {
    const seller = await this.userModel.findByIdAndDelete(id);

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    return seller;
  }
}
