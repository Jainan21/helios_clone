import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { CreateJewelryDto } from '../../jewelry/dto/create-jewelry.dto';

enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

class CollectionMediaDto {
  @IsString()
  url: string;

  @IsEnum(MediaType)
  type: MediaType;

  @IsOptional()
  @IsBoolean()
  isThumbnail?: boolean;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class CreateCollectionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CollectionMediaDto)
  medias?: CollectionMediaDto[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  jewelryIds?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJewelryDto)
  newJewelry?: CreateJewelryDto[];
}
