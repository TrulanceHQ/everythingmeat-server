import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import * as crypto from "node:crypto"
import axios from 'axios';
import { FlWRedirectDto } from './dto/redirect.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FlwTrans } from './flwTrans.schema';
import { Model } from 'mongoose';
import { Response } from 'express';

@Injectable()
export class PaymentService {
  constructor (  @InjectModel(FlwTrans.name) private flwModel: Model<FlwTrans>,
){

  }
 async create(createPaymentDto: CreatePaymentDto,res:Response) {
  const tx_ref =  crypto.randomBytes(8).toString('base64')
    try {
      const response = await axios.post(
        'https://api.flutterwave.com/v3/payments',
        {
          tx_ref,
          amount:  createPaymentDto.amount,
          currency: 'NGN',
          redirect_url: `https://payment-confirmation-5mek.onrender.com`,
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
            mode:'no-cors'
             
          },
      
        }
      );
            const newFlwTran = new this.flwModel({buyer:createPaymentDto.buyer._id,amount:createPaymentDto.amount,ref:tx_ref})
    const resul=  await newFlwTran.save()
      console.log(response.data.data.link)
      // res.redirect(response.data.data.link)
    return   res.json({"Flutter wave checkout link":response.data.data.link})
    } catch (err) {
      console.error(err);
      console.error(err.response.data);
    }
  }

  findAll() {
    return `This action returns all payment`;
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
