
import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BuyersService } from './buyers.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CreateOrderDto } from './create-order.dto';
import { RolesGuard } from 'src/utils/Roles/roles.guard';
import { Roles } from 'src/utils/Roles/roles.decorator';
import { BuyerResponseDto } from './dto/buyer-response.dto';

@ApiTags('Buyers')
@UseGuards(RolesGuard)
@ApiBearerAuth() // Enables Bearer Token in Swagger UI
@Controller('api/v1/buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}
    @Roles('buyer')
  @Post("cart")
  create(@Body( new ValidationPipe()) cartDto: CreateCatDto) {
    return this.buyersService.createCart(cartDto)
  }
  @Roles('buyer')
  @Patch("/cart")
  updateCartItem(@Query(new ValidationPipe({
    transform: true,
    transformOptions: {enableImplicitConversion: true},
    forbidNonWhitelisted: true
})) query:UpdateCartDto) {
    return this.buyersService.UpdateCartQty(query.cartId,query.slot)
  }

  @Roles('buyer')
  @Delete("/cart:id")
  removeCartItem(@Param('id') id:string ) {
    return this.buyersService.removeItem(id)
  }

  @Roles('buyer')
  @Post("order")
  createOrder(@Param('buyerId') buyerId:string) {
    return this.buyersService.createOrder(buyerId)
  }
  
  @Roles('buyer')
  @Get("cart/user:carts")
  async getAllCarts(@Query() query: any) {
    return this.buyersService.getAllCarts(query);
  }

  @Get('cart/user:userId')
  find(@Param('userId') userId: string) {
    console.log(userId)
    return this.buyersService.getBuyerCarts(userId);
  }
  
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto) {
  //   return this.buyersService.update(+id, updateBuyerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.buyersService.remove(+id);
  // }
}
