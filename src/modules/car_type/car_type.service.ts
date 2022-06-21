import { Injectable } from '@nestjs/common';
import { CreateCarTypeDto } from './dto/create-car_type.dto';
import { UpdateCarTypeDto } from './dto/update-car_type.dto';
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {Car_typeEntity} from "./entities/car_type.entity";
import {Like, Repository} from "typeorm";
import {Connection} from "mysql2";

@Injectable()
export class CarTypeService {
  constructor(
      @InjectRepository(Car_typeEntity) private readonly carType: Repository<Car_typeEntity>,
      @InjectConnection() private readonly connection: Connection
  ) {
  }

  async getCarType() {
    // return await this.carType.find({
    //   select: ["id", "typeName"],
    //   order: {
    //     ["firstDistanceFee"]: "ASC",
    //     ["typeName"]: "ASC",
    //   }
    // });
    // return await this.carType.find({ where: {typeName: Like(`%${name}%`)}});
    return await this.carType.find();
  }

  async getCarDetail(id: number) {
    return await this.carType.findOne(id, { select: ["typeName", "typeSlogan", "firstDistanceFee",
        "secondDistanceFee", "thirdDistanceFee", "fourthDistanceFee", "fifthDistanceFee", "sixthDistanceFee", "seventhDistanceFee", "platformFee", "waitingFee"]});
  }

  async searchCarByLocation(longitude: number, latitude: number, searchRadius: number) {
    await this.connection.query(
        `update car_type set price = 0`);
    await this.connection.query(
        `update car_type set price = ${Math.random() * 80} where (car_type.longitude between ${longitude - searchRadius/20} 
            and ${longitude + searchRadius/20}) and (latitude between ${latitude - searchRadius/20} and ${latitude + searchRadius/20})`);
    return this.carType.find({select: ["typeName", "typeSlogan", "price"]});
  }

  async create(carCreate: CreateCarTypeDto) {
    const car = await this.carType.create(carCreate);
    return await this.carType.save(car);
  }

}
