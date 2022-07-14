import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BookingEntity} from "./entities/booking.entity";
import { ResponseResult } from 'src/shared/ResponseResult';
import { TripEntity } from '../trips/entities/trip.entity';
import { Promotion } from '../promotion/entities/promotion.entity';
import { CarEntity } from '../car/entities/car.entity';
import { DriverEntity } from '../driver/entities/driver.entity';
import { PaymentMethod } from '../paymentmethod/entities/paymentmethod.entity';
import { HttpModule } from "@nestjs/axios";
import { CarTypeEntity } from '../car_type/entities/car_type.entity';
import { TripsModule } from "../trips/trips.module";


@Module({
  imports: [TypeOrmModule.forFeature([
    BookingEntity,
    TripEntity,
    Promotion,
    CarEntity,
    DriverEntity,
    PaymentMethod,
    CarTypeEntity
  ]),
    HttpModule,
    TripsModule,],
  controllers: [BookingsController],
  providers: [BookingsService,ResponseResult]
})
export class BookingsModule {}
