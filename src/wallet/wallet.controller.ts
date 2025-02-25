import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { CreditWalletDto } from './dto/credit-wallet.dto';
import { ApiOperation } from '@nestjs/swagger';
import { Order } from 'src/users/buyers/order.schema';
import { BuyerResponseDto } from 'src/users/buyers/dto/buyer-response.dto';

@Controller('api/v1/')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}
  
  @ApiOperation({ summary: 'Create a user wallet' })
  @Post('wallet/create')
  create(@Body(new ValidationPipe()) createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }


  @ApiOperation({ summary: 'Credit  user wallet' })
  @Post('creditWallet')
  creditWallet(@Body(new ValidationPipe()) creditWallet: CreditWalletDto) {
    return this.walletService.creditWallet(creditWallet);
  }



  // @ApiOperation({ summary: 'Get all wallet' })
  // @Get('allWallet')
  // findAll() {
  //   return this.walletService.findAll();
  // }

  @ApiOperation({ summary: 'get wallet by id' })
  @Get('wallet:walletId') 
  findOne(@Param('walletId') walletId: string) {
    return this.walletService.findOne(walletId);
  }

  // @ApiOperation({ summary: 'update a wallet' })
  // @Patch('wallet:id')
  // update(@Param('id') id: string, @Body() updateWalletDto: UpdateWalletDto) {
  //   return this.walletService.update(+id, updateWalletDto);
  // }

  // @ApiOperation({ summary: 'delete a wallet' })
  // @Delete('wallet:id')
  // remove(@Param('id') id: string) {
  //   return this.walletService.remove(+id);
  // }
}
