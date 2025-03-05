import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { Order, OrderSchema } from './order.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/auth/schema/user.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './cart.schema';
import { Product } from 'src/products/schema/product.schema';
import { WalletService } from 'src/wallet/wallet.service';
import { SellerService } from '../sellers/seller.service';
import { FlWRedirectDto } from 'src/payment/dto/redirect.dto';
import { FlwTrans } from 'src/payment/flwTrans.schema';
import * as flw from "flutterwave-node-v3"
import { PaymentService } from 'src/payment/payment.service';
import { Response } from 'express';
@Injectable()
export class BuyersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private prodModel: Model<Product>,
    @InjectModel(FlwTrans.name) private flwModel: Model<FlwTrans>, 
    private readonly paymentService:PaymentService,
  private readonly walletService:WalletService,
  private readonly   sellerService:SellerService

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
      try {
        console.log('updating... cart ......')
        const cart =  await  this.cartModel.findOne({_id:cartId})
        if(!cart) throw new BadRequestException("Cart does not exist")
      const resp =    await this.cartModel.updateOne({_id:cartId},{slot:qty});
      return resp
      } catch (error) {
        console.log(error)
        throw new InternalServerErrorException(error.message)
      }
    }
  
    async createOrder(buyerId:any,res:Response):Promise<any> {
      try {
        const soldOut:any[] = [];
        let totalAmount:number = 0; 
        const buyer = await this.userModel.findOne({_id:buyerId})
        const usersCart = await this.cartModel.find({status:true,buyer:buyer._id}).populate("prod")
        if(usersCart.length >0){
          usersCart.forEach((cart)=>{
            if(cart.slot > cart.prod.totalSlots) soldOut.push(cart.prod)
           else{
            totalAmount += cart.slot*cart.prod.productPrice
          } 
          })
          if(soldOut.length >0 ) {
            return  { message:'Following Items slot has been filled up/Reduce  the number slot Or pick slot for other items',status:200, data:soldOut}
          }

         await this.paymentService.create({amount:totalAmount,buyer},res)
          //check if buyer has a wallet
          // const wallet = await this.walletService.findUserWallet(buyerId)
          // if(!wallet) throw new BadRequestException("Buyer has no wallet, please create one")
          //   if (wallet.balance < totalAmount) throw new BadRequestException("Insufficient Fund")

      //amount buyer
      

      
          return "Success";
        }
        else throw new BadRequestException('Cart is empty')
           

   
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
      .populate('Product');
    for (let index = 0; index < usersCart.length; index++) {
      await this.prodModel.updateOne({
        _id: usersCart[index].prod._id,
        totalSlots: usersCart[index].prod.totalSlots - usersCart[index].slot,
      });
      await usersCart[index].updateOne({
        _id: usersCart[index]._id,
        status: false,
      });
    }
  }
  async saveOrder(id:any){
    try {
      //get buyer
      const buyer = await this.userModel.findOne({_id:id})
      //get users carts
    const usersCart = await this.cartModel.find({status:true,buyer:buyer._id}).populate("prod")
      for (let index = 0; index < usersCart.length; index++) {
        const userCart = usersCart[index]
        const slotsLeft =  userCart.prod.totalSlots - userCart.slot
       const grossAmount= userCart.slot*userCart.prod.productPrice
       const slot = userCart.slot
       const prod = userCart.prod._id
        //create order
         const newOrder = new this.orderModel({grossAmount:grossAmount,slot:slot,prod:prod,buyer:buyer._id})
       const savedOrder =  await newOrder.save()
         //acct sales for vendor
         await this.sellerService.createSale(usersCart[index],
          savedOrder)
          //credit truance account
            //create truance trnsaction
          await this.walletService.createTruanceTransaction(userCart,savedOrder)
        await this.prodModel.updateOne({
          _id: userCart.prod._id,
        
        },{ totalSlots:slotsLeft});
        //update cart or empty cart

        await userCart.updateOne({
          _id: userCart._id,
       
        },{   status: false,});
      }
    } catch (error) {
      console.log(error)
    }
    }
  async paymentCallBack(flwDto:FlWRedirectDto) {
    if (flwDto.status === 'successful') {
      const transactionDetails = await this.flwModel.findOne({ref: flwDto.tx_ref});
      const response = await flw.Transaction.verify({id: flwDto.transaction_id});
      if (
          response.data.status === "successful"
          && response.data.amount === transactionDetails.amount
          && response.data.currency === "NGN") {
            await  this.saveOrder(transactionDetails.buyer._id)
      } else {
          // Inform the customer their payment was unsuccessful
      }
  }
  }







}
