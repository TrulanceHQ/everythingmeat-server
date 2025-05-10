import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, isNotEmpty, IsNotEmpty } from 'class-validator';
import mongoose, { Document } from "mongoose";
import { User } from 'src/auth/schema/user.schema';
@Schema({ timestamps: true })
export class Order extends Document {
   @Prop([{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
}])
   buyer:mongoose.Schema.Types.ObjectId;
   delivery:string
   @Prop(
    {
        default:'Pending',
    }
   )
   status:string;
   @Prop([{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required:true
}])

prod:mongoose.Schema.Types.ObjectId;
grossAmount:number;
slot: number;

}
export const OrderSchema = SchemaFactory.createForClass(Order);
