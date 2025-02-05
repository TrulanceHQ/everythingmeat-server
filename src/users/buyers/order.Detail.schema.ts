import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, isNotEmpty, IsNotEmpty } from 'class-validator';
import mongoose, { Document } from "mongoose";
@Schema({ timestamps: true })
export class OrderDetail extends Document {

    @Prop([{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    }])

   prod:mongoose.Schema.Types.ObjectId;
   grossAmount:number;
   slot: number;
}
export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);
