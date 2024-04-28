import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';

class ProductCharacteristicDto {
	@IsString()
		name: string;

	@IsString()
		value: string;
}

export class CreateProductDto {
	@IsString()
		typegooseName: string;
		
	@IsString()
		image: string;

	@IsString()
		title: string;

	@IsString()
		link: string;

	@Max(5)
	@Min(1)
	@IsNumber()
		initialRating: number;

	@IsNumber()
		price: number;

	@IsOptional()
	@IsNumber()
		oldPrice?: number;

	@IsNumber()
		credit: number;

	@IsString()
		description: string;

	@IsString()
		advantages: string;

	@IsOptional()
	@IsString()
		disAdvantages?: string;

	@IsArray()
	@IsString({ each: true })
		categories: string[];

	@IsArray()
	@IsString({ each: true })
		tags: string[];

	@IsArray()
	@ValidateNested()
	@Type(() => ProductCharacteristicDto)
		characteristics: ProductCharacteristicDto[];
}