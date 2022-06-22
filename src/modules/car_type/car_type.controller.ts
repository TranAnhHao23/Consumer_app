import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CarTypeService } from './car_type.service';
import { CreateCarTypeDto } from './dto/create-car_type.dto';
import {SearchCarByLocationDto} from "./dto/search-car-by-location";

@ApiTags('car-type')
@Controller('v1/rhc/car-type')
export class CarTypeController {
  constructor(private readonly carTypeService: CarTypeService) {}

  // @Post()
  // create(@Body() car: CreateCarTypeDto) {
  //   return this.carTypeService.create(car);
  // }

  @Get('getcartype')
  findAll() {
    return this.carTypeService.getCarType();
  }

  @Get('getcardetail/:id')
  findOne(@Param('id') id: string) {
    return this.carTypeService.getCarDetail(id);
  }
  //
  @Post('searchcarbylocation')
  searchCarByLocation(@Body() searchCarByLocationDto: SearchCarByLocationDto) {
    console.log(searchCarByLocationDto);
    return this.carTypeService.searchCarByLocation(searchCarByLocationDto);
  }
}
