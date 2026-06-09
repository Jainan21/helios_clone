import { IsInt, Min } from 'class-validator';

export class AddCartItemDto {
  @IsInt()
  jewelryId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
