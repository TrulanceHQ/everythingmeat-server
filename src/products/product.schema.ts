import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from "mongoose";
@Schema()
export class Product extends Document {
name:string
stock:number
price:number
}
export const ProductSchema = SchemaFactory.createForClass(Product);
