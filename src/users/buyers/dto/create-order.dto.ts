import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import mongoose from "mongoose";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";
export class CreateOrderDto {
    @IsNotEmpty()
      @ApiProperty({ description: 'buyerId', example: 'btytniykmw477m' })
    buyerId:mongoose.Schema.Types.ObjectId;
        @IsNotEmpty()
        @IsArray()
        @ArrayMinSize(1)
    @ApiProperty({ description: 'productIds', example: ["btytniykmw477m"] })
    productId:string[]
}
