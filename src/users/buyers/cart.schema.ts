import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, isNotEmpty, IsNotEmpty } from 'class-validator';
import mongoose, { Document } from "mongoose";
import { User } from 'src/auth/schema/user.schema';
import { Product } from 'src/products/product.schema';
@Schema ({timestamps:true})
export class Cart extends Document {

    @Prop([{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }])

   items:[mongoose.Schema.Types.ObjectId];
   @Prop([{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
}])
   buyer:mongoose.Schema.Types.ObjectId;

   @Prop(
    {
        default:false,
    }
   )
   status:boolean;

}
export const OrderSchema = SchemaFactory.createForClass(Cart);