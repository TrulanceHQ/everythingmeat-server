import { Injectable, Inject } from '@nestjs/common';
import { v2 as Cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    try {
      const result: UploadApiResponse = await this.cloudinary.uploader.upload(
        file.path,
        { folder },
      );
      return result.secure_url;
    } catch (error) {
      throw new Error('Image upload failed');
    }
  }
}
