import { Module } from '@nestjs/common';
import { FavouriteLocationsService } from './favourite_locations.service';
import { FavouriteLocationsController } from './favourite_locations.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Favourite_locationEntity} from "./entities/favourite_location.entity";
import { ResponseResult } from 'src/shared/ResponseResult';

@Module({
  imports: [TypeOrmModule.forFeature([Favourite_locationEntity])],
  controllers: [FavouriteLocationsController],
  providers: [FavouriteLocationsService, ResponseResult]
})
export class FavouriteLocationsModule {}
