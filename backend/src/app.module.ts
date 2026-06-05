import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { JewelryModule } from './jewelry/jewelry.module';

@Module({
  imports: [PrismaModule, UsersModule, JewelryModule]
})
export class AppModule {}
