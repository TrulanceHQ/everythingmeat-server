import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BuyersService } from './buyers.service';
import { UpdateBuyerDto } from './dto/update-buyer.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('buyers')
export class BuyersController {
  constructor(private readonly buyersService: BuyersService) {}

  @Post()
  create(@Body() orderDto: CreateOrderDto) {
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBuyerDto: UpdateBuyerDto) {
    return this.buyersService.update(+id, updateBuyerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.buyersService.remove(+id);
  }
}
