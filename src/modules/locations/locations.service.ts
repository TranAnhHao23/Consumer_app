import {HttpStatus, Injectable} from '@nestjs/common';
import {CreateLocationDto} from './dto/create-location.dto';
import {UpdateLocationDto} from './dto/update-location.dto';
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {LocationEntity} from "./entities/location.entity";
import {createQueryBuilder, Repository} from "typeorm";
import {Connection} from "mysql2";
import {ResponseResult} from "../../shared/ResponseResult";

@Injectable()
export class LocationsService {
    constructor(
        @InjectRepository(LocationEntity) private readonly locationRepo: Repository<LocationEntity>,
        @InjectConnection() private readonly connection: Connection,
        private readonly apiResponse: ResponseResult,
    ) {
    }

    create(createLocationDto: CreateLocationDto) {
        return 'This action adds a new location';
    }

    findAll() {
        return `This action returns all locations`;
    }

    async findOne(id: number) {
        try {
            this.apiResponse.data = await this.locationRepo.findOne(id)
        } catch (error) {
            this.apiResponse.errorMessage = error;
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    update(id: number, updateLocationDto: UpdateLocationDto) {
        return `This action updates a #${id} location`;
    }

    remove(id: number) {
        return `This action removes a #${id} location`;
    }

    async getLocationHistory(deviceId: number) {
        const query = this.locationRepo
            .createQueryBuilder('location')
            .innerJoinAndSelect('trip', 'trip')
            .where('trip.device_id = :id', {id: deviceId})
            .andWhere('milestone <> 0')
            .andWhere('is_drafting = 1')
            .orderBy('location.createAt', 'DESC')
            .getMany();
        console.log(query)
        return query;
    }
}
