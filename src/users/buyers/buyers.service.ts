import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { Order } from './order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/auth/schema/user.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './cart.schema';
import { Product } from 'src/products/schema/product.schema';

@Injectable()
export class BuyersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private prodModel: Model<Product>,
  ) {}
  async findAll() {
    try {
      return await this.orderModel.find();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
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

  async createCart(createCartDto: CreateCartDto):Promise<any> {
    try {
      const user = await this.userModel.findOne({ _id: createCartDto.buyerId });
      if (!user) throw new BadRequestException('user does not exit');
      const prod = await this.prodModel.findOne({ _id: createCartDto.prodId });
      if (!prod) throw new BadRequestException('Product does not exit');

      //check available slot
      if (!this.checkSlotAvailable(prod, createCartDto.slot))
        throw new BadRequestException('Slot filled up');

      const newCart = new this.cartModel({
        buyer: user,
        prod: prod,
        slot: createCartDto.slot,
      });

      const cart = await newCart.save();
      return cart;
    } catch (error) {
      if (error.status < 500) throw new BadRequestException(error.message);
      throw new InternalServerErrorException(error.message);
    }
  }

    async getBuyerCarts (userId:string): Promise<Cart[]> {
      const user = await this.userModel.findOne({_id:userId})
      const carts = await this.cartModel.find({buyer:user,status:true}).populate('prod')
      return carts;

      //async getBuyerCarts(userId: string): Promise<Cart[]> {
  // Query the cart model to find carts where the buyer matches userId and the status is true
  //const carts = await this.cartModel.find({ buyer: userId, status: true }).populate('prod');
  //return carts;

    }

    async UpdateCartQty(cartId:string,qty:number) {
        const cart =  await  this.cartModel.findOne({_id:cartId})
        if(!cart) throw new BadRequestException("Cart does not exist")
      return this.cartModel.updateOne({_id:cartId,slot:qty});
    }
  
    async createOrder(buyerId:string):Promise<any> {
      try {
        const soldOut:any[] = [];
        let totalAmount:number = 0; 
        const usersCart = await this.cartModel.find({status:true,_id:buyerId}).populate("Product")
            usersCart.forEach((cart)=>{
              if(cart.slot > cart.prod.totalSlots) soldOut.push(cart.prod)
             else{
              totalAmount += cart.slot*cart.prod.productPrice
            } 
            })
            if(soldOut.length >0 ) {
              return  { message:'Following Items slot has been filled up/Reduce  the number slot Or pick slot for other items',status:200, data:soldOut}
            }
            // call payment service
      return "Processing Order";
      } catch (error) {
        if(error.status < 500) throw new BadRequestException(error.message) 
        throw new  InternalServerErrorException(error.message)
        
      }
          
       }

checkSlotAvailable(  prod:Product,
  slot:number):boolean{
 return prod.totalSlots > slot ?true:false
}

async updateProductAfterPaymnent(id:string){
  const usersCart = await this.cartModel.find({status:true,_id:id}).populate("Product")
  for (let index = 0; index < usersCart.length; index++) {
        await this.prodModel.updateOne({_id:usersCart[index].prod._id,totalSlots:usersCart[index].prod.totalSlots-usersCart[index].slot})
      await  usersCart[index].updateOne({_id:usersCart[index]._id,status:false})
  }
}

  async removeItem(cartId: string) {
    const cart = await this.cartModel.findOne({ _id: cartId });
    if (!cart) throw new BadRequestException('Cart does not exist');
    return this.cartModel.deleteOne({ _id: cartId });
  }

  async getAllCarts(query: any): Promise<Cart[]> {
    const { page = 1, limit = 10 } = query;
    const cart = await this.cartModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return cart;
  }

  // async getBuyerCarts(userId: string): Promise<Cart[]> {
  //   const user = await this.userModel.findOne({ _id: userId });
  //   const carts = await this.cartModel
  //     .find({ buyer: user, status: true })
  //     .populate('prod');
  //   return carts;
  // }

  // async UpdateCartQty(cartId: string, qty: number) {
  //   const cart = await this.cartModel.findOne({ _id: cartId });
  //   if (!cart) throw new BadRequestException('Cart does not exist');
  //   return this.cartModel.updateOne({ _id: cartId, slot: qty });
  // }

  // checkSlotAvailable(prod: Product, slot: number): boolean {
  //   return prod.totalSlots > slot ? true : false;
  // }

  // async updateProductAfterPaymnent(id: string) {
  //   const usersCart = await this.cartModel
  //     .find({ status: true, _id: id })
  //     .populate('Product');
  //   for (let index = 0; index < usersCart.length; index++) {
  //     await this.prodModel.updateOne({
  //       _id: usersCart[index].prod._id,
  //       totalSlots: usersCart[index].prod.totalSlots - usersCart[index].slot,
  //     });
  //     await usersCart[index].updateOne({
  //       _id: usersCart[index]._id,
  //       status: false,
  //     });
  //   }
  // }
}