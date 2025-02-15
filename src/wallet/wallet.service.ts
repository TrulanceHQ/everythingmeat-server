import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { Wallet } from './wallet.schema';
import { Transaction } from './transaction.schema';
import { Cart } from 'src/users/buyers/cart.schema';
import { TruanceWallet } from './trulance-wallet.schema';
import { Order } from 'src/users/buyers/order.schema';
import { CreditWalletDto } from './dto/credit-wallet.dto';
import { use } from 'passport';

@Injectable()
export class WalletService {
    constructor(
      @InjectModel(User.name) private userModel: Model<User>,
      @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
      @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
      @InjectModel(TruanceWallet.name) private truanceWalletModel: Model<TruanceWallet>,
      

  
    ) {}
  async create(createWalletDto: CreateWalletDto) {
      const user = await this.userModel.findOne({_id:createWalletDto.userId})
      const existingWallet = await this.walletModel.findOne({user:user._id}).exec()
      if(existingWallet) throw new ConflictException('User already has a wallet')
       const newWallet = new this.walletModel({user:user})
       const wallet = await newWallet.save()
  }

 async findAll() {
    return await  this.walletModel.find();
  }

 async findOne(id: string) {
    return await this.walletModel.findOne({_id:id});
  }

 async findUserWallet(userId:string){
    const user = await this.userModel.findOne({_id:userId})
    return await  this.walletModel.findOne({user:user._id})
 }
 async creditWallet(creditDto:CreditWalletDto){
     const user  = await this.userModel.findOne({_id:creditDto.userId})
     const wallet = await this.walletModel.findOne({user:user._id}).exec()
     const newTransaction =new this.transactionModel({amount:creditDto.amount,transactionType:'CREDIT',user:user})
   const transaction=  await newTransaction.save()
     wallet.transactionHistory.push(transaction)
     wallet.balance = wallet.balance+creditDto.amount
  //   
   return  await  wallet.save();
 }
 async debitWallet(buyer:User,amount:number,transactionType:string,order:Order){
  const wallet = await this.walletModel.findOne({user:buyer._id})
  const newTransaction =new this.transactionModel({amount:amount,transactionType:transactionType,user:buyer,order:order})
  const transaction=  await newTransaction.save()
  console.log( wallet)
    wallet.transactionHistory.push(transaction)
    wallet.balance = wallet.balance+amount
    //
  return   wallet.save();
}

async createTruanceTransaction(cart:Cart,order:Order){
  const seller = await this.userModel.find({_id:cart.prod.sellerId})
  const amount = cart.prod.productPrice*cart.slot
  const newTransaction =new this.truanceWalletModel({seller:seller,order:order,buyer:cart.buyer,amount:amount})
return await  newTransaction.save()
}



  // update(id: number, updateWalletDto: UpdateWalletDto) {
  //   return `This action updates a #${id} wallet`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} wallet`;
  // }
}
