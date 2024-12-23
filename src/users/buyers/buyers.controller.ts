import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateCatDto } from './dto/create-cat.dto';

@Controller('api/v1/buyers/order')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}
  
  @Post("cart")
  create(@Body( new ValidationPipe()) cartDto: CreateCatDto) {
    return this.buyersService.createCart(cartDto)
  }
  @Patch("/cart-item")
  updateCartItem(@Query('query') query:any ) {
    const {cartId,qty} = query
    return this.buyersService.UpdateCartQty(cartId,qty)
  }
  @Delete("/cart:id")
  removeCartItem(@Param('id') id:string ) {
    return this.buyersService.removeItem(id)
  }





  @Get()
  findAll() {
    return this.buyersService.findAll();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.buyersService.findOne(+id);
  }
  ///

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto) {
    return this.buyersService.update(+id, updateBuyerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyersService.remove(+id);
  }
}
