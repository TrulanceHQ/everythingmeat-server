import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { developmentConfig, productionConfig } from './config';
import { AuthModule } from './auth/auth.module';
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
        console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
        console.log(`Connecting to MongoDB with URI: ${uri}`);
        console.log('NODE_ENV:', process.env.NODE_ENV);
        console.log(
          'DEV_MONGODB_CONNECTION_URL:',
          process.env.DEV_MONGODB_CONNECTION_URL,
        );
        console.log('Resolved envFilePath:', path.resolve(__dirname, '.env'));
        if (!uri) {
          throw new Error('MongoDB connection URI is undefined');
        }
        return { uri };
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
