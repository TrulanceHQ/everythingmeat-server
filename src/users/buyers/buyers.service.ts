import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { Order } from './order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class BuyersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}
 async createOrder(createOrderDto: CreateOrderDto):Promise<any> {
try {
  const buyerOrder = new  this.orderModel(createOrderDto)
const order = await buyerOrder.save()
return order;
} catch (error) {
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
