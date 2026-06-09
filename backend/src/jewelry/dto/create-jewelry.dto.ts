import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested } from "class-validator";

enum MediaType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
}

enum JewelryStatus {
    ACTIVE = "ACTIVE",
    SOLD_OUT = "SOLD_OUT",
    NEW_IN = "NEW_IN",
    PRE_ORDER = "PRE_ORDER",
    HIDDEN = "HIDDEN",
}

enum JewelryType {
    SILVER_RING = "SILVER_RING",
    SILVER_BRACELET = "SILVER_BRACELET",
    SILVER_NECKLACE = "SILVER_NECKLACE",
    SILVER_PENDANT = "SILVER_PENDANT",
    SILVER_CHARM = "SILVER_CHARM",
    SILVER_EARRINGS = "SILVER_EARRINGS",
    GOLD_JEWELRY = "GOLD_JEWELRY",
    GLASSES = "GLASSES",
    LEATHER_CRAFT = "LEATHER_CRAFT",
    OTHER_ACCESSORY = "OTHER_ACCESSORY",
}

class CreateMediaDto {
    @IsString()
    url:string

    @IsEnum(MediaType)
    type: MediaType

    @IsOptional()
    @IsBoolean()
    isThumbnail?: boolean

    @IsOptional()
    @IsInt()
    sortOrder?: number
}

export class CreateJewelryDto {
    @IsString()
    name:string

    @IsInt()
    @Min(0)
    price:number

    @IsString()
    description: string

    @IsOptional()
    @IsString()
    material?: string

    @IsOptional()
    @IsString()
    stone?: string

    @IsOptional()
    @IsEnum(JewelryStatus)
    status?: JewelryStatus

    @IsOptional()
    @IsEnum(JewelryType)
    type?: JewelryType

    @IsString()
    slug: string

    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>CreateMediaDto)
    medias?: CreateMediaDto[]
}
