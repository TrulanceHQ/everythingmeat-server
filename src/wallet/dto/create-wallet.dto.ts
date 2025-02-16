import { ApiOperation, ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, isString } from "class-validator";

export class CreateWalletDto {
    @IsNotEmpty()
    @ApiProperty({ description: 'userId', example: 'btytniykmw477m' })
    userId:string
   
      
}