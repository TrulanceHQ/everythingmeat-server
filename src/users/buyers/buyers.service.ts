import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { Order } from './order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/auth/schema/user.schema';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cart } from './cart.schema';
import { Product } from 'src/products/product.schema';

@Injectable()
export class BuyersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private prodModel: Model<Product>,
  ) {}
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

  async createCart(createCartDto: CreateCatDto):Promise<any> {
    try {
      const user =  await  this.userModel.findOne({_id:createCartDto.buyerId})
      if(!user) throw new BadRequestException("user does not exit")
        /**
         * this is to be uncommented when the product schema has been created
         */
      //   const prod =  await  this.prodModel.findOne({_id:createCartDto.prodId})
      // if(!prod) throw new BadRequestException("Product does not exit")
    
      const newCart =  new this.cartModel({buyer:user,prodId:createCartDto.prodId,qty:createCartDto.qty})
    
    const cart = await newCart.save()
    return cart;
    } catch (error) {
      if(error.status < 500) throw new BadRequestException(error.message) 
      throw new  InternalServerErrorException(error.message)
      
    }
        
     }

    async removeItem(cartId:string) {
      // const user =  await  this.userModel.findOne({_id:userId})
      // if(!user) throw new BadRequestException("user does not exit")
        const cart =  await  this.cartModel.findOne({_id:cartId})
        if(!cart) throw new BadRequestException("Cart does not exist")
      return  this.cartModel.deleteOne({_id:cartId});
    }
    
    async UpdateCartQty(cartId:string,qty:number) {
      // const user =  await  this.userModel.findOne({_id:userId})
      // if(!user) throw new BadRequestException("user does not exit")
        const cart =  await  this.cartModel.findOne({_id:cartId})
        if(!cart) throw new BadRequestException("Cart does not exist")
      return  this.cartModel.updateOne({_id:cartId,qty:qty});
    }
  
    async createOrder(createOrderDto: CreateOrderDto):Promise<any> {
      try {
        const soldOut:any[] = []
        let totalAmount:number = 0
        const usersCart = await this.cartModel.find({status:true}).populate("Product")
            usersCart.forEach((cart)=>{
              totalAmount += cart.qty*cart.prod.price
              if(cart.qty > cart.prod.stock) soldOut.push(cart.prod)
            })

            if(soldOut.length >0 ) {
              return  { message:'Following Items/Product is out of Stock',status:200, data:soldOut}
            }
      //We need payment service here to complete the order flow

      return;
      } catch (error) {
        if(error.status < 500) throw new BadRequestException(error.message) 
        throw new  InternalServerErrorException(error.message)
        
      }
          
       }
















}
