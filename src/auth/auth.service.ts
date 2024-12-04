import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { CreateUserDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ emailAddress: createUserDto.emailAddress })
      .exec();
    if (existingUser) {
      throw new ConflictException(
        'Email address has been used by another customer',
      );
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async login(emailAddress: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ emailAddress }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
