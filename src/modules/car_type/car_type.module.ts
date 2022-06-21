import { Module } from '@nestjs/common';
import { CarTypeService } from './car_type.service';
import { CarTypeController } from './car_type.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Car_typeEntity} from "./entities/car_type.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Car_typeEntity])],
  controllers: [CarTypeController],
  providers: [CarTypeService]
})
export class CarTypeModule {}
