import { Module } from '@nestjs/common';
import { CarTypeService } from './car_type.service';
import { CarTypeController } from './car_type.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Car_typeEntity} from "./entities/car_type.entity";
import { ResponseResult } from "../../shared/ResponseResult";
import {Car_detailEntity} from "./entities/car_detail.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Car_typeEntity, Car_detailEntity])],
  controllers: [CarTypeController],
  providers: [CarTypeService, ResponseResult]
})
export class CarTypeModule {}
