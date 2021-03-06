import { Module } from '@nestjs/common';
import { TripsService } from './trips.service';
import { TripsController } from './trips.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TripEntity} from "./entities/trip.entity";
import { ResponseResult } from "../../shared/ResponseResult";
import { LocationsService } from '../locations/locations.service';
import { LocationEntity } from '../locations/entities/location.entity';
import { CarTypeEntity } from '../car_type/entities/car_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
      TripEntity,
      LocationEntity,
      CarTypeEntity
    ]),
  ],
  controllers: [TripsController],
  providers: [TripsService, LocationsService, ResponseResult],
  exports: [TripsService]
})
export class TripsModule {}
