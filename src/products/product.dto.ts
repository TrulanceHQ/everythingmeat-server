import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
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

  @ApiPropertyOptional({ description: 'Slaughter & Process Date' })
  @IsString()
  @IsOptional()
  processDate?: string;

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

export class UpdateProductDto extends PartialType(CreateProductDto) {}
