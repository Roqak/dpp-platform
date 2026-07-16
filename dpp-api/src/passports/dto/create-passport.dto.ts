import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class MaterialDto {
  @IsString() name: string;
  @IsNumber() percentage: number;
  @IsString() origin: string;
}

class PackagingDto {
  @IsString() type: string;
  @IsString() recyclable: boolean;
}

export class CreatePassportDto {
  @IsString()
  productName: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsString()
  category: string;

  @IsString()
  manufacturer: string;

  @IsString()
  countryOfOrigin: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialDto)
  materials: MaterialDto[];

  @IsNumber()
  @IsOptional()
  weightKg?: number;

  @IsObject()
  @IsOptional()
  packaging?: PackagingDto;
}
