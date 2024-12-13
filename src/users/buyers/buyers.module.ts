import { Module } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { BuyersController } from './buyers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './order.schema';

@Module({
  imports: [  MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])],
  controllers: [BuyersController],
  providers: [BuyersService,

  ],
})
export class BuyersModule {}
