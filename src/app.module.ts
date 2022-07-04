import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as path from 'path'; 
import { SharedModule } from './shared/shared.module';
import { ORMModule } from './config/orm/orm.module';  
import {
  AcceptLanguageResolver,
  I18nJsonLoader,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n'; 
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './core/http-error.filter';
import { LoggingInterceptor } from './core/logging.interceptor';
import { TripsModule } from './modules/trips/trips.module';
import { LocationsModule } from './modules/locations/locations.module';
import { FavouriteLocationsModule } from './modules/favourite_locations/favourite_locations.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { CarTypeModule } from './modules/car_type/car_type.module';
import { ResponseResult } from './shared/ResponseResult'; 
import { InvoiceModule } from './modules/invoice/invoice.module';
import { PaymentmethodModule } from './modules/paymentmethod/paymentmethod.module';
import { PromotionModule } from './modules/promotion/promotion.module'; 
import { CarModule } from './modules/car/car.module';
import { DriverModule } from './modules/driver/driver.module';

@Module({
  imports: [
    ORMModule, 
    ConfigModule, 
    SharedModule,
    I18nModule.forRoot({
      fallbackLanguage: 'th',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }), 
    TripsModule,
    LocationsModule,
    FavouriteLocationsModule,
    BookingsModule,
    CarTypeModule,
    InvoiceModule,
    PaymentmethodModule,
    PromotionModule,
    CarModule,
    DriverModule 
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ResponseResult,
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
  ],
})
export class AppModule {}
