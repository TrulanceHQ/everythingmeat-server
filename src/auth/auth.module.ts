import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UsersController } from './auth.controller';
import { User, UserSchema } from './schema/user.schema';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from '../utils/Roles/roles.guard';
import { LocalStrategy } from 'src/utils/LocalGuard/local.strategy';
import { EmailModule } from 'src/utils/email/email.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    EmailModule,
    CloudinaryModule,
  ],
  controllers: [UsersController],
  providers: [AuthService, LocalStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
