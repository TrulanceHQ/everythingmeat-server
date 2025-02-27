import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import * as crypto from "node:crypto"
import axios from 'axios';
import { FlWRedirectDto } from './dto/redirect.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FlwTrans } from './flwTrans.schema';
import { Model } from 'mongoose';
import * as flw from "flutterwave-node-v3"
import { BuyersService } from 'src/users/buyers/buyers.service';

@Injectable()
export class PaymentService {
  constructor (  @InjectModel(FlwTrans.name) private flwModel: Model<FlwTrans>,
  private readonly buyerService:BuyersService
){

  }
 async create(createPaymentDto: CreatePaymentDto) {
  const tx_ref =  crypto.randomBytes(8).toString('base64')
    try {
      const response = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        {
          tx_ref,
          amount:  createPaymentDto.amount,
          currency: 'NGN',
          redirect_url: 'https://example_company.com/success',
          customer: {
            email:  createPaymentDto.buyer.emailAddress,
            name:  `${createPaymentDto.buyer.firstName}   ${createPaymentDto.buyer.lastName}`,
            phonenumber: createPaymentDto.buyer.phoneNumber1,
          },
          customizations: {
            title: 'Everything Meat Payment',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const newFlwTran = new this.flwModel({buyer:createPaymentDto.buyer,amount:createPaymentDto.amount,ref:tx_ref})
      await newFlwTran.save()
      return  response.data
    } catch (err) {
      console.error(err.code);
      console.error(err.response.data);
    }
  }

  findAll() {
    return `This action returns all payment`;
  }

  async paymentCallBack(flwDto:FlWRedirectDto) {
    if (flwDto.status === 'successful') {
      const transactionDetails = await this.flwModel.findOne({ref: flwDto.tx_ref});
      const response = await flw.Transaction.verify({id: flwDto.transaction_id});
      if (
          response.data.status === "successful"
          && response.data.amount === transactionDetails.amount
          && response.data.currency === "NGN") {
          // Success! Confirm the customer's payment
          await this.buyerService.createOrder(transactionDetails.buyer._id)
      } else {
          // Inform the customer their payment was unsuccessful
      }
  }
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
  createBuyerWallet(){
    
  }
}
