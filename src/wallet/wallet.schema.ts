import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Transaction } from './transaction.schema';

@Schema({ timestamps: true })
export class Wallet extends Document {
  @Prop({ required: true,default:0 })
  balance: number;
   userType:string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user:User;
  @Prop({ required: true ,
           ref: 'Transaction',
  })
  transactionHistory:[Transaction];
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);