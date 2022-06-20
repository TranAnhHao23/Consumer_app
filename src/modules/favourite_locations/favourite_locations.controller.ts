import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavouriteLocationsService } from './favourite_locations.service';
import { CreateFavouriteLocationDto } from './dto/create-favourite_location.dto';
import { UpdateFavouriteLocationDto } from './dto/update-favourite_location.dto';

@Controller('favourite-locations')
export class FavouriteLocationsController {
  constructor(private readonly favouriteLocationsService: FavouriteLocationsService) {}

  @Post()
  create(@Body() createFavouriteLocationDto: CreateFavouriteLocationDto) {
    return this.favouriteLocationsService.create(createFavouriteLocationDto);
  }

  @Get()
  findAll() {
    return this.favouriteLocationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favouriteLocationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavouriteLocationDto: UpdateFavouriteLocationDto) {
    return this.favouriteLocationsService.update(+id, updateFavouriteLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favouriteLocationsService.remove(+id);
  }
}
