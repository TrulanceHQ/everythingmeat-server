import { Injectable, Inject } from '@nestjs/common';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const stream = this.cloudinary.uploader.upload_stream(
          { folder },
          (error: any, result: UploadApiResponse) => {
            if (error) {
              reject(new Error('Image upload failed'));
            } else {
              resolve(result.secure_url); // Returns the secure URL of the uploaded image
            }
          },
        );

        stream.end(file.buffer); // To Upload the file buffer
      });
    } catch (error) {
      throw new Error('Image upload failed');
    }
  }
}
