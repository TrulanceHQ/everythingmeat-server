import { IsString, IsNumber, IsDate, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product' })
  @IsString()
  productName: string;

  @ApiProperty({ description: 'Size of the product' })
  @IsNumber()
  @Type(() => Number) // Transform the incoming string to a number
  productSize: number;

  @ApiPropertyOptional({
    description: 'Health satisfaction image (single)',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  healthSatisfactionImage?: any;

  @ApiProperty({ description: 'Slaughter & Process Date' })
  @IsDate()
  @Type(() => Date) // Transform the incoming string to a date
  processDate: Date;

  @ApiProperty({ description: 'Location' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Price' })
  @IsNumber()
  @Type(() => Number) // Transform the incoming string to a number
  productPrice: number;

  @ApiPropertyOptional({
    description: 'Product Images (multiple)',
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  @IsOptional()
  productImages?: any[];

  @ApiProperty({ description: 'Slots' })
  @IsNumber()
  @Type(() => Number) // Transform the incoming string to a
  totalSlots: number;
}
