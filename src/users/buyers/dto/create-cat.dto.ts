import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import mongoose from "mongoose";
interface CartItem {
  productId:string,
  qty:number
}
export class CreateCatDto {
    @IsNotEmpty()
      @ApiProperty({ description: 'buyerId', example: 'btytniykmw477m' })
    buyerId:mongoose.Schema.Types.ObjectId;
        @IsNotEmpty()
    @ApiProperty({description: 'productId', example: "btytniykmw477m"})
    prodId: string
    @ApiProperty({description: 'Quantity of product needed', example: 20})
    slot: number

}
