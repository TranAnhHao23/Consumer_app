import {Module} from '@nestjs/common';
import {LocationsService} from './locations.service';
import {LocationsController} from './locations.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {LocationEntity} from "./entities/location.entity";
import {TripEntity} from "../trips/entities/trip.entity";

@Module({
    imports: [TypeOrmModule.forFeature([
        LocationEntity,
        TripEntity,
    ]),
    ],
    controllers: [LocationsController],
    providers: [LocationsService]
})
export class LocationsModule {
}
