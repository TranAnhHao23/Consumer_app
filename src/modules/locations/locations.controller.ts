import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    const savedLocation = await this.locationsService.create(createLocationDto);
    return {
      data: savedLocation
    }
  }

  // @Get()
  // findAll() {
  //   return this.locationsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.locationsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
  //   return this.locationsService.update(+id, updateLocationDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.locationsService.remove(+id);
  // }
}
