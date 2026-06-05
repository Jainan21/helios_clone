import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JewelryService } from './jewelry.service';
import { CreateJewelryDto } from './dto/create-jewelry.dto';
import { UpdateJewelryDto } from './dto/update-jewelry.dto';

@Controller('jewelry')
export class JewelryController {
  constructor(private readonly jewelryService: JewelryService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  upload(@UploadedFile() file: any) {
    return this.jewelryService.uploadMedia(file);
  }

  @Post()
  create(@Body() createJewelryDto: CreateJewelryDto) {
    return this.jewelryService.create(createJewelryDto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.jewelryService.findAll({
      status,
      search,
      page: Number(page),
      limit: Number(limit),
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jewelryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJewelryDto: UpdateJewelryDto) {
    return this.jewelryService.update(+id, updateJewelryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jewelryService.remove(+id);
  }
}
