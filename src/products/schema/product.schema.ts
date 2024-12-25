import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../auth/schema/user.schema';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  productName: string;

  @Prop({ required: true })
  productSize: number;

  @Prop({ required: false })
  healthSatisfactionImage?: string;

  @Prop({ type: [String], default: [] }) // Array of image URLs
  productImages: string[];

  @Prop({ required: true })
  processDate: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  productPrice: number;

  @Prop({ required: true })
  totalSlots: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // Reference to User (Seller)
  createdBy: User;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
