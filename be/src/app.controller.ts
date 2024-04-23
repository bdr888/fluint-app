import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateDataDto, UpdateDataDto } from './data.dto';

@Controller('data')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getAll() {
    return this.appService.getAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appService.findOne(id);
  }

  @Post()
  create(@Body() createDataDto: CreateDataDto) {
    return this.appService.create(createDataDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDataDto: UpdateDataDto) {
    return this.appService.update(id, updateDataDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appService.remove(id);
  }
}
