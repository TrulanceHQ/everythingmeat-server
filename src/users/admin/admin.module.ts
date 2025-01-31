import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
