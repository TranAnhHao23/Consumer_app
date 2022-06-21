import { Module } from '@nestjs/common';
import { CarTypeService } from './car_type.service';
import { CarTypeController } from './car_type.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Car_typeEntity} from "./entities/car_type.entity";
import { ResponseResult } from "../../shared/ResponseResult";

@Module({
  imports: [TypeOrmModule.forFeature([Car_typeEntity])],
  controllers: [CarTypeController],
  providers: [CarTypeService, ResponseResult]
})
export class CarTypeModule {}
