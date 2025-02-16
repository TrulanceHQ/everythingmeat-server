import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Transaction } from './transaction.schema';
import { Order } from 'src/users/buyers/order.schema';




@Schema({ timestamps: true })
export class TruanceWallet extends Document {
  @Prop({ required: true,default:0 })
  amount: number;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  buyer:User;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  seller:User
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order:Order
  @Prop({ required: true,default:'PENDING'})
  status:String
}

export const TrulanceWalletSchema = SchemaFactory.createForClass(TruanceWallet);


