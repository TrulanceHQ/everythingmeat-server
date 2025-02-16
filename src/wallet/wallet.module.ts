import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { Product, ProductSchema } from 'src/products/schema/product.schema';
import { Cart, CartSchema } from 'src/users/buyers/cart.schema';
import { Order, OrderSchema } from 'src/users/buyers/order.schema';
import { Transaction, TransactionSchema } from './transaction.schema';
import { Wallet, WalletSchema } from './wallet.schema';
import {TruanceWallet, TrulanceWalletSchema } from './trulance-wallet.schema';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  exports:[WalletService],
  imports:[    MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Transaction.name, schema: TransactionSchema },
        {name:Wallet.name,schema:WalletSchema},
        {name:TruanceWallet.name,schema:TrulanceWalletSchema},
      ]),]
})
export class WalletModule {}
