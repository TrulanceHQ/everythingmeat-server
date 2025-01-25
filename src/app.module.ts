import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { developmentConfig, productionConfig } from './config';
import { AuthModule } from './auth/auth.module';
import { BuyersModule } from './users/buyers/buyers.module';
import * as dotenv from 'dotenv';
dotenv.config();
console.log(process.env.DEV_MONGODB_CONNECTION_URL);
import { SellerModule } from './users/sellers/seller.module';
import { AdminModule } from './users/admin/admin.module';
import { ProductModule } from './products/product.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, './../../.env'),
      load:
        process.env.NODE_ENV === 'development'
          ? [developmentConfig]
          : [productionConfig],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>(
          process.env.NODE_ENV === 'production'
            ? 'production.mongodbConnectionUrl'
            : 'development.mongodbConnectionUrl',
        );
        if (!uri) {
          throw new Error('MongoDB connection URI is undefined');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
    BuyersModule,
    SellerModule,
    AdminModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
