import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, isString } from "class-validator";

export class CreditWalletDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'userId', example: 'btytniykmw477m' })
    userId:string;
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({ description: 'amount', example: 5000 })
    amount:number

    
}