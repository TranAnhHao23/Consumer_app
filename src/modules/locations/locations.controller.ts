import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';

import { UpdateLocationDto } from './dto/update-location.dto';
import {ApiTags} from "@nestjs/swagger";
import { ResponseResult } from 'src/shared/ResponseResult';

@ApiTags('location')
@Controller('v1/rhc/locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly apiResponse: ResponseResult
  ) {}

  // @Post()
  // async create(@Body() createLocationDto: CreateLocationDto) {
  //   const savedLocation = await this.locationsService.create(createLocationDto);
  //   return {
  //     data: savedLocation
  //   }
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.locationsService.remove(id);
      this.apiResponse.status = HttpStatus.OK
    } catch (error) {
      this.apiResponse.errorMessage = error
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR
    }

    return this.apiResponse
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
}
