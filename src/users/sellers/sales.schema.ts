import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Product } from 'src/products/schema/product.schema';
import { Order } from '../buyers/order.schema';

@Schema({ timestamps: true })
export class Sales extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  @Prop({ required: true,default:'PENDING' })
  payment:string;
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    seller:User;
    @Prop({ required: true, type: Types.ObjectId, ref: 'Order'})
    orderId:Order;
}

export const SaleSchema = SchemaFactory.createForClass(Sales)