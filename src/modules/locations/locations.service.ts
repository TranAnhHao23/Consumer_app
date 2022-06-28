import {HttpStatus, Injectable} from '@nestjs/common';
import {CreateLocationDto} from './dto/create-location.dto';
import {UpdateLocationDto} from './dto/update-location.dto';
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {LocationEntity} from "./entities/location.entity";
import {Repository} from "typeorm";
import {Connection} from "mysql2";
import {TripEntity} from '../trips/entities/trip.entity'
import {ResponseResult} from "../../shared/ResponseResult";
import {query} from "express";

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(LocationEntity) private readonly locationRepo: Repository<LocationEntity>,
        @InjectRepository(TripEntity)
        private readonly tripRepo: Repository<TripEntity>,
        @InjectConnection() private readonly connection: Connection,
        private readonly apiResponse: ResponseResult,
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
        await console.log(typeof location.trip);
        return location;
    }

    update(id: number, updateLocationDto: UpdateLocationDto) {
        return `This action updates a #${id} location`;
    }

    remove(id: string) {
        return `This action removes a #${id} location`;
    }

    async getLocationHistory(userId: string) {
        try {
            const frequentLocation: LocationEntity[] = [];
            let googleIdLatests = (await this.getThreeLatestLocation(userId)).map(data => data.googleId);
            for (const googleIdLatest of googleIdLatests) {
                const query = await this.locationRepo.createQueryBuilder('location')
                    .where('google_id = :googleId', {googleId: googleIdLatest})
                    .orderBy('createdAt', 'DESC')
                    .getOne();
                frequentLocation.push(query);
            }
            this.apiResponse.data = frequentLocation;
        } catch (error) {
            this.apiResponse.status = HttpStatus.NOT_FOUND;
        }
        return this.apiResponse;
    }

    async getThreeFrequentLocationByGoogleId(userId: string) {
        try {
            const frequentLocation: LocationEntity[] = [];
            let googleIdFrequents = (await this.getThreeFrequentGoogleId(userId)).map(data => data.googleId);
            for (const googleIdFrequent of googleIdFrequents) {
                const query = await this.locationRepo.createQueryBuilder('location')
                    .where('google_id = :googleId', {googleId: googleIdFrequent})
                    .orderBy('createdAt', 'DESC')
                    .getOne();
                frequentLocation.push(query);
            }
            this.apiResponse.data = frequentLocation;
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR
        }
        return this.apiResponse;
    }

    async getThreeFrequentGoogleId(userId: string) {
        const query = await this.locationRepo
            .createQueryBuilder('location')
            .select([
                'location.googleId',
                // 'location.address',
            ])
            .innerJoinAndSelect('booking', 'booking', 'location.trip_id = booking.trip_id')
            .where('user_Id = :userId', {userId: userId})
            .andWhere('milestone<>0')
            .andWhere('')
            .groupBy('location.google_id')
            .orderBy('count(*)', 'DESC')
            .limit(3)
            .getMany()
        console.log(query)
        return query;
    }

    async getThreeLatestLocation(userId: string) {
        const query = await this.locationRepo
            .createQueryBuilder('location')
            .innerJoinAndSelect('booking', 'booking', 'location.trip_id = booking.trip_id')
            .where('user_Id = :userId', {userId: userId})
            .andWhere('milestone <> 0')
            .groupBy('location.google_id')
            .orderBy('createdAt', 'DESC')
            .getMany();
        console.log(query);
        return query;
    }

}
