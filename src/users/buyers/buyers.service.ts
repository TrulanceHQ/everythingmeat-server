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
import {Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { User } from 'src/auth/schema/user.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { Cart } from './cart.schema';
import { Product } from 'src/products/schema/product.schema';
import { WalletService } from 'src/wallet/wallet.service';
import { SellerService } from '../sellers/seller.service';
import { FlWRedirectDto } from 'src/payment/dto/redirect.dto';
import { FlwTrans } from 'src/payment/flwTrans.schema';
const Flutterwave = require('flutterwave-node-v3');
import { PaymentService } from 'src/payment/payment.service';
// const flw = require("flutterwave-node-v3")
import { Response } from 'express';
@Injectable()
export class BuyersService {
  private flw: any;
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @InjectModel(Product.name) private prodModel: Model<Product>,
    @InjectModel(FlwTrans.name) private flwModel: Model<FlwTrans>, 
    private readonly paymentService:PaymentService,
  private readonly walletService:WalletService,
  private readonly   sellerService:SellerService

  ) {
    this.flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
  }
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
  async saveOrder(transDetail:FlwTrans){
    try {
      //get buyer
      console.log('Checking if buyer exit.......')
      const buyer = await this.userModel.findOne({_id:transDetail.buyer._id})
      //get users carts
      console.log("..getting buyer's carts ...............")
    const usersCart = await this.cartModel.find({status:true,buyer:buyer._id}).populate("prod")
      for (let index = 0; index < usersCart.length; index++) {
        const userCart = usersCart[index]
        const slotsLeft =  userCart.prod.totalSlots - userCart.slot
       const grossAmount= userCart.slot*userCart.prod.productPrice
       const slot = userCart.slot
       const prod = userCart.prod._id
        //create order
        console.log('creating new user order..................')
         const newOrder = new this.orderModel({grossAmount:grossAmount,slot:slot,prod:prod,buyer:buyer._id})
       const savedOrder =  await newOrder.save()
         //acct sales for vendor
         console.log('create sales account for vendor..................')
      const salesAcct=   await this.sellerService.createSale(usersCart[index],
          savedOrder)
          //credit truance account
            //create truance trnsaction
            console.log('crediting tuance wallet..................')     
    await this.walletService.createTruanceTransaction(userCart,savedOrder)
    console.log("updating prod sales..............................")
     const prodU=   await this.prodModel.updateOne({
          _id: userCart.prod._id,
        
        },{ totalSlots:slotsLeft});
        //update cart or empty cart
        console.log("updating user cart..............................")
     const upCart=   await userCart.updateOne({
          _id: userCart._id,
       
        },{   status: false,});
      }
      console.log("..updating transactionza")
      await this.flwModel.updateOne({ref:transDetail.ref},{isActive:false})
      return "Success"
    } catch (error) {
      console.log(error)
         throw new InternalServerErrorException(error.message)
    }
    }
  async paymentCallBack(flwDto:any) {
    let res = ""
    console.log("..checking if payment is completed or successfull")
    if (flwDto.status =='completed') {
      console.log(".. payment is completed or successfull")
      const transactionDetails = await this.flwModel.findOne({ref: flwDto.tx_ref});
      console.info("check if the tx_ref is used")
      if(!transactionDetails?.isActive){
        console.log('tx_ref has been used...........')
        throw new BadRequestException('used tx_ref...............')
      }
      console.log("verifying transaction.......................")
      const response = await this.flw.Transaction.verify({id: flwDto.transaction_id});
      console.log(response)
      if (
          response.data.status === "successful"
          && response.data.amount === transactionDetails.amount
          && response.data.currency === "NGN") {
            console.info("Saving order..................")
            console.log(transactionDetails)
          const resp =  await  this.saveOrder(transactionDetails)
               console.log(resp)
            res= resp
      } else {
        console.log("not successfull")
        throw new BadRequestException('Payment failed')
    
          // Inform the customer their payment was unsuccessful
      }
  }
  return res;
  }

  async viewOrder(orderId: string){
    try{
      const order = await this.orderModel.findById(orderId)
      .populate('prod', 'name price')
      .exec();

      if(!order) {
        throw new NotFoundException('Order not found');
    
      }
      return order;

    } catch(error){
      throw new InternalServerErrorException(error.message);
    }
  }

  async viewAllOrders(buyerId: string) {
    try {
      if (!Types.ObjectId.isValid(buyerId)) {
        throw new BadRequestException('Invalid buyer ID format');
      }
  
      const orders = await this.orderModel
        .find({ buyer: buyerId })
        .populate('prod', 'name price')
        .exec();
  
      if (!orders || orders.length === 0) {
        throw new NotFoundException('No orders found for this buyer');
      }
      
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw new InternalServerErrorException('An unexpected error occurred');
    }
  }
  
}



