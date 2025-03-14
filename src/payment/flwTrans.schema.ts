import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
import { User } from 'src/auth/schema/user.schema';
@Schema({ timestamps: true })
export class FlwTrans extends Document {
    @Prop()
    ref:string
   status:string;
   @Prop({
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
})

buyer:User;
@Prop()
amount:number;
@Prop({
    default:true
})
isActive:boolean

}
export const FlwTransSchema = SchemaFactory.createForClass(FlwTrans);
