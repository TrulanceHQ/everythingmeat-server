import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
import { User } from 'src/auth/schema/user.schema';
import { Product } from 'src/products/product.schema';
@Schema ({timestamps:true})
export class Order extends Document {
    @Prop([{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }])
   items:[Product]
   @Prop([{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
}])
   buyer:User;
   @Prop(
    {
        default:false,
    }
   )
   status:boolean

}
export const OrderSchema = SchemaFactory.createForClass(Order);