import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get(':userId')
  findByUser(@Param('userId') userId: string) {
    return this.cartService.findByUser(Number(userId));
  }

  @Post(':userId/items')
  addItem(@Param('userId') userId: string, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(Number(userId), dto);
  }

  @Patch(':userId/items/:jewelryId')
  updateItem(
    @Param('userId') userId: string,
    @Param('jewelryId') jewelryId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(Number(userId), Number(jewelryId), dto);
  }

  @Delete(':userId/items/:jewelryId')
  removeItem(@Param('userId') userId: string, @Param('jewelryId') jewelryId: string) {
    return this.cartService.removeItem(Number(userId), Number(jewelryId));
  }

  @Delete(':userId')
  clear(@Param('userId') userId: string) {
    return this.cartService.clear(Number(userId));
  }
}
