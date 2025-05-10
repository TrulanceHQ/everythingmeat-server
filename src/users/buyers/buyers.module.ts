import { Module } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { BuyersController } from './buyers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { Cart, CartSchema } from './cart.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { SellerModule } from '../sellers/seller.module';
import { PaymentModule } from 'src/payment/payment.module';
import { FlwTrans, FlwTransSchema } from 'src/payment/flwTrans.schema';

@Module({
  imports: [
    PaymentModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'default_secret'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: User.name, schema: UserSchema },
      { name: Cart.name, schema: CartSchema },
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
       { name: FlwTrans.name, schema:FlwTransSchema }
    ]),
    WalletModule,
    AuthModule,
    SellerModule,
  ],
  controllers: [BuyersController],
  providers: [BuyersService],
})
export class BuyersModule {}
