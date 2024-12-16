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

  @Prop({ required: false })
  image?: string;

  @Prop({ required: false, enum: Gender })
  gender: Gender;
}

export const UserSchema = SchemaFactory.createForClass(User);
