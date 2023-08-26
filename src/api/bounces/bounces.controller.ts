import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BouncesService } from './bounces.service';
import { CreateBounceDto } from './dto/create-bounce.dto';
import { UpdateBounceDto } from './dto/update-bounce.dto';

@Controller('bounces')
export class BouncesController {
  constructor(private readonly bouncesService: BouncesService) {}

  @Post()
  create(@Body() createBounceDto: CreateBounceDto) {
    return this.bouncesService.create(createBounceDto);
  }

  @Get()
  findAll() {
    return this.bouncesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bouncesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBounceDto: UpdateBounceDto) {
    return this.bouncesService.update(+id, updateBounceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bouncesService.remove(+id);
  }
}
