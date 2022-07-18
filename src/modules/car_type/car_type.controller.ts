import {Controller, Get, Post, Body, Param, UseFilters, Res} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CarTypeService } from './car_type.service';
import { CreateCarTypeDto } from './dto/create-car_type.dto';
import {SearchCarByLocationDto} from "./dto/search-car-by-location";
import {HttpExceptionFilter} from "../../shared/http-exception.filter";
import {Response} from "express";

@ApiTags('car-type')
@Controller('v1/rhc/car-type')
@UseFilters(new HttpExceptionFilter())
export class CarTypeController {
  constructor(private readonly carTypeService: CarTypeService) {}

  // @Post()
  // create(@Body() car: CreateCarTypeDto) {
  //   return this.carTypeService.create(car);
  // }

  @Get('getcartype/:idCar')
  async getCarTypeByIdCar(@Param('idCar') idCar: string, @Res() res: Response) {
    const result = await this.carTypeService.getCarTypeByIdCar(idCar);
    return res.status(result.status).json(result);
  }

  @Post('searchcarbylocation')
  async searchCarByLocation(@Body() searchCarByLocationDto: SearchCarByLocationDto, @Res() res: Response) {
    const result = await this.carTypeService.searchCarByLocation(searchCarByLocationDto);
    return res.status(result.status).json(result);
  }

  @Get('getpricebycartype/:distance')
  async getPriceByCarType(@Param('distance') distance: string, @Res() res: Response) {
    const result = await this.carTypeService.getPriceByCarType(+distance);
    return res.status(result.status).json(result);
  }

}
