import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from './cloudinary.service';

describe('CloudinaryService', () => {
  let service: CloudinaryService;

  beforeEach(async () => {
    const mockCloudinary = {
      uploader: {
        upload_stream: jest.fn((options, callback) => {
          const result = { secure_url: 'http://mock-url.com/image.jpg' };
          callback(null, result); // Simulate a successful upload
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CloudinaryService,
        {
          provide: 'CLOUDINARY',
          useValue: mockCloudinary, // Provide a mocked Cloudinary instance
        },
      ],
    }).compile();

    service = module.get<CloudinaryService>(CloudinaryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload a single image and return its secure URL', async () => {
    const mockFile = {
      buffer: Buffer.from('mock data'),
    } as Express.Multer.File;

    const result = await service.uploadImage(mockFile, 'test-folder');
    expect(result).toBe('http://mock-url.com/image.jpg');
  });
});
