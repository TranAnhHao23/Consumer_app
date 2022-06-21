import {Module} from '@nestjs/common';
import {LocationsService} from './locations.service';
import {LocationsController} from './locations.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LocationEntity} from "./entities/location.entity";
import {TripEntity} from "../trips/entities/trip.entity";
import { ResponseResult } from 'src/shared/ResponseResult';

@Module({
    imports: [TypeOrmModule.forFeature([
        LocationEntity,
        TripEntity,
    ]),
    ],
    controllers: [LocationsController],
    providers: [LocationsService, ResponseResult]
})
export class LocationsModule {
}
