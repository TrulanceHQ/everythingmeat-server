import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  // ApiOperation,
  // ApiBody,
  // ApiResponse,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { BuyersService } from './buyers.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
// import { CreateOrderDto } from './create-order.dto';
import { RolesGuard } from 'src/utils/Roles/roles.guard';
import { Roles } from 'src/utils/Roles/roles.decorator';
// import { BuyerResponseDto } from './dto/buyer-response.dto';

@ApiTags('Buyers')
@UseGuards(RolesGuard)
@ApiBearerAuth() // Enables Bearer Token in Swagger UI
@Controller('api/v1')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}
    @Roles('buyer')
    @ApiOperation({ summary: 'Create a Cart' })
    @Post("cart/add")
  create(@Body( new ValidationPipe()) cartDto: CreateCartDto) {
    return this.buyersService.createCart(cartDto)
  }
  @Roles('buyer')
  @Patch("/cart/update")
  @ApiOperation({ summary: 'Update the Cart' })
  updateCartItem(@Query(new ValidationPipe({
    transform: true,
    transformOptions: {enableImplicitConversion: true},
    forbidNonWhitelisted: true
})) query:UpdateCartDto) {
    return this.buyersService.UpdateCartQty(query.cartId,query.slot)
  }

  @Roles('buyer')
  @Delete("/cart/remove/:id")
  @ApiOperation({ summary: 'Remove an Item from the Cart' })
  removeCartItem(@Param('id') id:string ) {
    return this.buyersService.removeItem(id)
  }

  @Roles('buyer')
  @Post("orders")
  @ApiOperation({ summary: 'Place a new Order' })
  createOrder(@Param('buyerId') buyerId:string) {
    return this.buyersService.createOrder(buyerId)
  }
  
  @Roles('buyer')
  @ApiOperation({ summary: 'Get all Buyers in the Cart' })
  @Get("cart/user:carts")
  async getAllCarts(@Query() query: any) {
    return this.buyersService.getAllCarts(query);
  }
  @ApiOperation({ summary: 'Get the current user(ID) Cart Item' })
  @Get('cart')
  find(@Param('userId') userId: string) {
    console.log(userId);
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
