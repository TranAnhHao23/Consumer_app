import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarTypeService } from './car_type.service';
import { CreateCarTypeDto } from './dto/create-car_type.dto';
import { UpdateCarTypeDto } from './dto/update-car_type.dto';
import {Car_typeEntity} from "./entities/car_type.entity";

@Controller('car-type')
export class CarTypeController {
  constructor(private readonly carTypeService: CarTypeService) {}

  @Post()
  create(@Body() car: CreateCarTypeDto) {
    return this.carTypeService.create(car);
  }

  @Get('getcartype')
  findAll() {
    return this.carTypeService. getCarType();
  }

  @Get('getcardetail/:id')
  findOne(@Param('id') id: string) {
    return this.carTypeService.getCarDetail(+id);
  }

}
