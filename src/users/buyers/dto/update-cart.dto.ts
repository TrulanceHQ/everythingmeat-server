import { ApiProperty } from "@nestjs/swagger";
import { ArrayMinSize, IsArray, IsNotEmpty } from 'class-validator';
import mongoose from "mongoose";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";

import { IsString, IsNumber } from 'class-validator';
 export class UpdateCartDto {
     @IsNotEmpty()
       @ApiProperty({ description: 'cartId', example: 'btytniykmw477m' })
       cartId:string;
       @IsNotEmpty()
     @ApiProperty({ description: 'slot', example:5 })
     slot:number
}