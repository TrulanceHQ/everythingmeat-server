import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Order } from 'src/users/buyers/order.schema';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true})
  transactionType: string;
  @Prop({ required: true })
  amount:number;
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user:User;
    @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
    order:Order;
    
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);