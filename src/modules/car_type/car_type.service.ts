import { Injectable } from '@nestjs/common';
import { CreateCarTypeDto } from './dto/create-car_type.dto';
import { UpdateCarTypeDto } from './dto/update-car_type.dto';
import {InjectConnection, InjectRepository} from "@nestjs/typeorm";
import {Car_typeEntity} from "./entities/car_type.entity";
import {Repository} from "typeorm";
import {Connection} from "mysql2";

@Injectable()
export class CarTypeService {
  constructor(
      @InjectRepository(Car_typeEntity) private readonly carType: Repository<Car_typeEntity>,
      @InjectConnection() private readonly connection: Connection
  ) {
  }

  async getCarType() {
    // return await this.carType.find({select: ["id", "typeName"]});
    return await this.carType.find();
  }

  async getCarDetail(id: number) {
    return await this.carType.findOne({select: ["carImage", "typeName", "typeSlogan", "firstDistanceFee", "secondDistanceFee", "thirdDistanceFee", "fourthDistanceFee", "fifthDistanceFee", "sixthDistanceFee", "seventhDistanceFee", "platformFee", "waitingFee"]});
  }

  async findByLocation(location: string) {
    return ;
  }

  async create(car: CreateCarTypeDto) {
    return await this.carType.save(car);
  }

}
