import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { FlwTrans, FlwTransSchema } from './flwTrans.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  exports:[PaymentService],
  imports:[
     MongooseModule.forFeature([
          { name: FlwTrans.name, schema:FlwTransSchema },]),
          PaymentModule
  ]
})
export class PaymentModule {}
