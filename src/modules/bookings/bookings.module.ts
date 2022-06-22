import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookingEntity} from "./entities/booking.entity";
import { ResponseResult } from 'src/shared/ResponseResult';
import { TripEntity } from '../trips/entities/trip.entity';


@Module({
  imports: [TypeOrmModule.forFeature([BookingEntity,TripEntity])],
  controllers: [BookingsController],
  providers: [BookingsService,ResponseResult]
})
export class BookingsModule {}
