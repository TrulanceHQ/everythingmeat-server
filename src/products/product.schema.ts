import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
@Schema()
export class Product extends Document {}
export const ProductSchema = SchemaFactory.createForClass(Product);
