import { Module } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { BuyersController } from './buyers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { Cart, CartSchema } from './cart.schema';
import { Product, ProductSchema } from 'src/products/product.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema },{ name: User.name, schema: UserSchema },{ name: Cart.name, schema: CartSchema },{ name: User.name, schema: UserSchema },{ name: Product.name, schema:ProductSchema },]),
  ],
  controllers: [BuyersController],
  providers: [BuyersService,

  ],
})
export class BuyersModule {}
