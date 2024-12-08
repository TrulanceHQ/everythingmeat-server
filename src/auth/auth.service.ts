import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schema/user.schema';
import { CreateUserDto } from './auth.dto';
import * as bcrypt from 'bcryptjs';

export interface LoginResponse {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel
      .findOne({ emailAddress: createUserDto.emailAddress })
      .exec();
    if (existingUser) {
      throw new ConflictException(
        'Email address has been used by another customer',
      );
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async login(
    emailAddress: string,
    password: string,
  ): Promise<LoginResponse | null> {
    const user = await this.userModel.findOne({ emailAddress }).exec();
    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate JWT token
      const payload = {
        emailAddress: user.emailAddress,
        sub: user._id,
        role: user.role,
      };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
}
