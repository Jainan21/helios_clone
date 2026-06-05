import { PartialType } from '@nestjs/mapped-types';
import { CreateJewelryDto } from './create-jewelry.dto';

export class UpdateJewelryDto extends PartialType(CreateJewelryDto) {}
