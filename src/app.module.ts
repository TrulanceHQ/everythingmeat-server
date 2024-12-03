import * as path from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { developmentConfig, productionConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '.env'),
      load:
        process.env.NODE_ENV === 'production'
          ? [productionConfig]
          : [developmentConfig],
    }),
    MongooseModule.forRoot(process.env.DEV_MONGODB_CONNECTION_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
