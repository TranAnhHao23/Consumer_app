import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookingEntity} from "./entities/booking.entity";
import { ResponseResult } from 'src/shared/ResponseResult';
import { TripEntity } from '../trips/entities/trip.entity';
import { Promotion } from '../promotion/entities/promotion.entity';
import { LocationEntity } from '../locations/entities/location.entity';


@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity,TripEntity,Promotion, LocationEntity])],
  controllers: [BookingsController],
  providers: [BookingsService,ResponseResult]
})
export class BookingsModule {}
