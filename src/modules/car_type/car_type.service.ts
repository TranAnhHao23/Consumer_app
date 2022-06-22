import {HttpStatus, Injectable} from '@nestjs/common';
import {CreateCarTypeDto} from './dto/create-car_type.dto';
import {UpdateCarTypeDto} from './dto/update-car_type.dto';
import {InjectConnection, InjectRepository} from '@nestjs/typeorm';
import {Car_typeEntity} from './entities/car_type.entity';
import {Like, Repository} from 'typeorm';
import {Connection} from 'mysql2';
import {ResponseResult} from '../../shared/ResponseResult';
import {SearchCarByLocationDto} from "./dto/search-car-by-location";
import {Car_detailEntity} from "./entities/car_detail.entity";

@Injectable()
export class CarTypeService {
    constructor(
        @InjectRepository(Car_typeEntity)
        private readonly carRepo: Repository<Car_typeEntity>,
        @InjectRepository(Car_detailEntity)
        private readonly carDetailRepo: Repository<Car_detailEntity>,
        @InjectConnection() private readonly connection: Connection,
        private readonly apiResponse: ResponseResult,
    ) {
    }

    async getCarType() {
        // return await this.carRepo.find({
        //   select: ["id", "typeName"],
        //   order: {
        //     ["firstDistanceFee"]: "ASC",
        //     ["typeName"]: "ASC",
        //   }
        // });
        // return await this.carRepo.find({ where: {typeName: Like(`%${name}%`)}});
        try {
            // @ts-ignore
            this.apiResponse.data = await this.carRepo.find({
                order: {['orders']: 'ASC'}
            });
        } catch (error) {
            this.apiResponse.errorMessage = error;
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async getCarDetail(id: string) {
        try {
            // @ts-ignore
            this.apiResponse.data = await this.carRepo.findOne(id, {
                relations: ["carDetails"],
                order: {
                    // carDetails: {['orders']: 'ASC'},
                    orders: 'ASC'
                },
            })

            // const query = await this.carDetailRepo.createQueryBuilder('car_detail')
            //     .innerJoinAndSelect('car_type', 'car_type')
            //     .where("car_detail.car_type_id = :id", {id: id})
            //     .orderBy({'car_detail.orders': 'ASC'})
            //     .getMany()
            // // console.log(query)
            // this.apiResponse.data = query;
        } catch (error) {
            this.apiResponse.errorMessage = error;
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async searchCarByLocation(searchCarByLocationDto: SearchCarByLocationDto) {
      try {
        await this.connection.query(`update car_type set price = 0`);
        await this.connection.query(
          `update car_type set price = ${Math.random() * 80} 
              where (car_type.longitude between ${+searchCarByLocationDto.longitude - (searchCarByLocationDto.searchRadius / 20)}
              and ${+searchCarByLocationDto.longitude + (searchCarByLocationDto.searchRadius / 20)})
              and (latitude between ${+searchCarByLocationDto.latitude - searchCarByLocationDto.searchRadius / 20}
              and ${+searchCarByLocationDto.latitude + searchCarByLocationDto.searchRadius / 20})`);
        this.apiResponse.data = await this.carRepo.find({
          select: ['typeName', 'typeSlogan', 'price'],
        });
      } catch (error) {
        this.apiResponse.errorMessage = error;
        this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
      return this.apiResponse;
    }
    //
    // async create(carCreate: CreateCarTypeDto) {
    //   try {
    //     const car = await this.carRepo.create(carCreate);
    //     await this.carRepo.save(car);
    //     this.apiResponse.data = await this.carRepo.find();
    //   } catch (error) {
    //     this.apiResponse.errorMessage = error;
    //     this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    //   }
    //   return this.apiResponse;
    // }
}