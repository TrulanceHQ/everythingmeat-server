import { Module } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { BuyersController } from './buyers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';
import { User, UserSchema } from 'src/auth/schema/user.schema';

@Module({
  imports: [  MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema },{ name: User.name, schema: UserSchema }])],
  controllers: [BuyersController],
  providers: [BuyersService,

  ],
})
export class BuyersModule {}
