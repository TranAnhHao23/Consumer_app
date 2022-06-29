import { Module } from '@nestjs/common';
import { CarTypeService } from './car_type.service';
import { CarTypeController } from './car_type.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {CarTypeEntity} from "./entities/car_type.entity";
import { ResponseResult } from "../../shared/ResponseResult";
import {CarDetailEntity} from "./entities/car_detail.entity";

@Module({
  imports: [TypeOrmModule.forFeature([CarTypeEntity, CarDetailEntity])],
  controllers: [CarTypeController],
  providers: [CarTypeService, ResponseResult]
})
export class CarTypeModule {}
