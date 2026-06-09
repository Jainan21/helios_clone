import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { JewelryModule } from './jewelry/jewelry.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [PrismaModule, UsersModule, JewelryModule, CartModule]
})
export class AppModule {}
