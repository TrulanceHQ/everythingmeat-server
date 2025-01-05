import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import * as bcrypt from 'bcryptjs';

export enum UserRole {
  ADMIN = 'admin',
  BUYER = 'buyer',
  SELLER = 'seller',
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

@Schema()
export class User extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  emailAddress: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  // Seller-specific fields
  @Prop({ enum: Gender, required: false })
  gender?: Gender;

  @Prop({ required: false })
  phoneNumber1?: string;

  @Prop({ required: false })
  phoneNumber2?: string;

  @Prop({ required: false })
  image?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
