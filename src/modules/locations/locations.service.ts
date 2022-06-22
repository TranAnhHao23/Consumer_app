import {Injectable} from '@nestjs/common';
import {CreateLocationDto} from './dto/create-location.dto';
import {UpdateLocationDto} from './dto/update-location.dto';
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {LocationEntity} from "./entities/location.entity";
import {Repository} from "typeorm";
import {Connection} from "mysql2";
import { TripEntity } from '../trips/entities/trip.entity'

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(LocationEntity) private readonly locationRepo: Repository<LocationEntity>,

        @InjectRepository(TripEntity)
        private readonly tripRepo: Repository<TripEntity>,

        @InjectConnection() private readonly connection: Connection,
    ) {
    }

    async create(createLocationDto: CreateLocationDto) {
      const trip = await this.tripRepo.findOne(createLocationDto.tripId)
      const newLocation = this.locationRepo.create({...createLocationDto, trip})
      const savedLocation = await newLocation.save()
      return savedLocation
    }

    findAll() {
        return `This action returns all locations`;
    }

    async findOne(id: number) {
        const location = await this.locationRepo.findOne(id);
        await console.log(typeof  location.trip);
        return location;
    }

    update(id: number, updateLocationDto: UpdateLocationDto) {
        return `This action updates a #${id} location`;
    }

    remove(id: string) {
        return `This action removes a #${id} location`;
    }

    async getLocationHistory(deviceId: number) {
        let locationsHistory = await this.connection.query(`select * from location inner join trip on location.trip_id = trip.id 
                        where trip.device_id = ${deviceId} and location.milestone <> 0 and is_drafting = 0 order by trip.createdAt desc`);
        return locationsHistory;

    }
}
