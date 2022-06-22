import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCarTypeDto } from './dto/create-car_type.dto';
import { UpdateCarTypeDto } from './dto/update-car_type.dto';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Car_typeEntity } from './entities/car_type.entity';
import { Like, Repository } from 'typeorm';
import { Connection } from 'mysql2';
import { ResponseResult } from '../../shared/ResponseResult';

@Injectable()
export class CarTypeService {
  constructor(
    @InjectRepository(Car_typeEntity)
    private readonly carType: Repository<Car_typeEntity>,
    @InjectConnection() private readonly connection: Connection,
    private readonly apiResponse: ResponseResult,
  ) {}

  async getCarType() {
    // return await this.carType.find({
    //   select: ["id", "typeName"],
    //   order: {
    //     ["firstDistanceFee"]: "ASC",
    //     ["typeName"]: "ASC",
    //   }
    // });
    // return await this.carType.find({ where: {typeName: Like(`%${name}%`)}});
    try {
      this.apiResponse.data = await this.carType.find();
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async getCarDetail(id: number) {
    try {
      this.apiResponse.data = await this.carType.findOne(id, {
        select: [
          'typeName',
          'typeSlogan',
          'firstDistanceFee',
          'secondDistanceFee',
          'thirdDistanceFee',
          'fourthDistanceFee',
          'fifthDistanceFee',
          'sixthDistanceFee',
          'seventhDistanceFee',
          'platformFee',
          'waitingFee',
        ],
      });
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async searchCarByLocation(
    longitude: number,
    latitude: number,
    searchRadius: number,
  ) {
    try {
      await this.connection.query(`update car_type set price = 0`);
      await this.connection.query(
        `update car_type set price = ${
          Math.random() * 80
        } where (car_type.longitude between ${longitude - searchRadius / 20} 
            and ${longitude + searchRadius / 20}) and (latitude between ${
          latitude - searchRadius / 20
        } and ${latitude + searchRadius / 20})`,
      );
      this.apiResponse.data = this.carType.find({
        select: ['typeName', 'typeSlogan', 'price'],
      });
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async create(carCreate: CreateCarTypeDto) {
    try {
      const car = await this.carType.create(carCreate);
      await this.carType.save(car);
      this.apiResponse.data = await this.carType.find();
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }
}
