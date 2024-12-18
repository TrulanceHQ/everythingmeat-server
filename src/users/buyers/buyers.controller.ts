import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('api/v1/buyers/order')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}
  
  @Post()
  create(@Body( new ValidationPipe()) orderDto: CreateOrderDto) {
    console.log(orderDto)
    return this.buyersService.createOrder(orderDto)
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
