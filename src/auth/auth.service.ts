// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Auth } from './auth.schema';

// @Injectable()
// export class AuthService {
//   constructor(@InjectModel(Auth.name) private userModel: Model<Auth>) {}

//   async create(userDto: any): Promise<Auth> {
//     const createdUser = new this.userModel(userDto);
//     return createdUser.save();
//   }

//   async findAll(): Promise<Auth[]> {
//     return this.userModel.find().exec();
//   }
// }
