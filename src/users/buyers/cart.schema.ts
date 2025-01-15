import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { number } from 'joi';
import mongoose, { Document } from "mongoose";
import { Product } from 'src/products/schema/product.schema';

@Schema ({timestamps:true})
export class Cart extends Document {

    @Prop({
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product',
            required:true
        })
   prod:Product;
   @Prop({
        type:number,
        required:true
   })
   slot:number;
   @Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
})
   buyer:mongoose.Schema.Types.ObjectId;

   @Prop(
    {
        default:true,
    } 
   )
   status:boolean;

}
export const CartSchema = SchemaFactory.createForClass(Cart);
