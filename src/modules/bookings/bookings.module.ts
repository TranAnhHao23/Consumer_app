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


@Module({
  imports: [TypeOrmModule.forFeature([
    BookingEntity,
    TripEntity,
    Promotion,
    CarEntity,
    DriverEntity,
    PaymentMethod,
    HttpModule
  ])],
  controllers: [BookingsController],
  providers: [BookingsService,ResponseResult]
})
export class BookingsModule {}
