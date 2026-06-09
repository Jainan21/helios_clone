import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { JewelryModule } from './jewelry/jewelry.module';
import { CartModule } from './cart/cart.module';
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [PrismaModule, UsersModule, JewelryModule, CartModule, CollectionsModule]
})
export class AppModule {}
