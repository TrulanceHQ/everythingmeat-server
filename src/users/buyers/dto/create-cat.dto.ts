import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
// import mongoose from 'mongoose';
// interface CartItem {
//   productId: string;
//   qty: number;
// }
export class CreateCatDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'buyerId', example: 'btytniykmw477m' })
  buyerId: string;
  @IsNotEmpty()
  @ApiProperty({ description: 'productId', example: 'btytniykmw477m' })
  prodId: string;
  @IsNotEmpty()
  @ApiProperty({ description: 'Quantity of product needed', example: 20 })
  slot: number;
}
