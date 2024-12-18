import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { Order } from './order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/auth/schema/user.schema';

@Injectable()
export class BuyersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
 async createOrder(createOrderDto: CreateOrderDto):Promise<any> {
try {
  const user =  await  this.userModel.findOne({_id:createOrderDto.buyerId})
  if(!user) throw new BadRequestException("user does not exit")

  const buyerOrder = new  this.orderModel({buyer:user,}) 
const order = await buyerOrder.save()
return order;
} catch (error) {
  if(error.status < 500) throw new BadRequestException(error.message) 
  throw new  InternalServerErrorException(error.message)
  
}
    
  }

 async  findAll() {
try {
  return await    this.orderModel.find(); 
} catch (error) {

  throw new  InternalServerErrorException(error.message) 
}


  }

  findOne(id: number) {
    return `This action returns a #${id} buyer`;
  }

  update(id: number, updateBuyerDto: UpdateBuyerDto) {
    return `This action updates a #${id} buyer`;
  }

  remove(id: number) {
    return `This action removes a #${id} buyer`;
  }

}
