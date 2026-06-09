import { Module } from '@nestjs/common';
import { JewelryService } from './jewelry.service';
import { JewelryController } from './jewelry.controller';

@Module({
  controllers: [JewelryController],
  providers: [JewelryService],
})
export class JewelryModule {}
