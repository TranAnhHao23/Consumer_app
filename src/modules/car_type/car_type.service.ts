import {HttpStatus, Injectable} from '@nestjs/common';
import {CreateCarTypeDto} from './dto/create-car_type.dto';
import {UpdateCarTypeDto} from './dto/update-car_type.dto';
import {InjectConnection, InjectRepository} from '@nestjs/typeorm';
import {CarTypeEntity} from './entities/car_type.entity';
import {Like, Repository} from 'typeorm';
import {Connection} from 'mysql2';
import {ResponseResult} from '../../shared/ResponseResult';
import {SearchCarByLocationDto} from "./dto/search-car-by-location";
import {CarDetailEntity} from "./entities/car_detail.entity";

enum CarSize {
    'S',
    'M',
    'L',
}
@Injectable()
export class CarTypeService {
    constructor(
        @InjectRepository(CarTypeEntity)
        private readonly carRepo: Repository<CarTypeEntity>,
        @InjectRepository(CarDetailEntity)
        private readonly carDetailRepo: Repository<CarDetailEntity>,
        @InjectConnection() private readonly connection: Connection,
        private apiResponse: ResponseResult,
    ) {
    }

    async getCarType() {
        this.apiResponse = new ResponseResult();
        try {
            // @ts-ignore
            this.apiResponse.data = await this.carRepo.find({
                order: {['orders']: 'ASC'}
            });
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async getCarTypeByIdCar(idCar: string) {
        this.apiResponse = new ResponseResult();
        try {
            let carTypeEntity = await this.carRepo.findOne(idCar, {
                select: ['typeName', 'typeSlogan', 'carImage'],
                relations: ['carDetails'],
                order: {
                    ['orders']: 'ASC'
                },
            })
            let carDetails = await this.getCarDetailByIdCar(idCar);
            // @ts-ignore
            carTypeEntity.carDetails = carDetails.data;
            this.apiResponse.data = carTypeEntity;
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async getCarDetailByIdCar(idCar: string) {
        this.apiResponse = new ResponseResult();
        try {
            const query = await this.carDetailRepo.createQueryBuilder('car_detail')
                .innerJoinAndSelect('car_type', 'car_type')
                .where("car_detail.car_type_id = :id", {id: idCar})
                .orderBy({'car_detail.orders': 'ASC'})
                .getMany()
            this.apiResponse.data = query
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async searchCarByLocation(searchCarByLocationDto: SearchCarByLocationDto) {
        this.apiResponse = new ResponseResult();
        try {
            const cars = await this.carRepo.find({
                select: ['typeName', 'carIcon', 'latitude', 'longitude'],
            });
            for (let i = 0; i < (cars).length; i++) {
                console.log(cars.length)
                // console.log(cars[i])
                let distance =await this.calculateDistanceBetweenCarAndConsumer(searchCarByLocationDto, cars[i])
                await console.log(distance);
                if (distance > searchCarByLocationDto.searchRadius) {
                    cars.splice(i, 1);
                    i--;
                }
                // await console.log(cars);
            }
            this.apiResponse.data = cars;
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async getPriceByCarType(distance: number) {
        this.apiResponse = new ResponseResult();
        try {
            let cars = await this.carRepo.find();
            for (let car of cars) {
                car.price = await this.calculatePrice(distance, car.id);
                await this.carRepo.update({id: car.id}, car);
            }
            let carCategories = (await this.carRepo.createQueryBuilder('car_type')
                .select('category')
                .distinct(true)
                .getRawMany()).map(data => data.category);
            let result: any[] = [];
            for (const carCategory of carCategories) {
                let cars = await this.carRepo.createQueryBuilder('car_type')
                    .where('category = :category', {category: carCategory})
                    .orderBy('orders', 'ASC')
                    .getMany();
                result.push({
                    category: carCategory,
                    cars: cars,
                })
            }
            this.apiResponse.data = result;
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async getCarSize(idCarType: string) {
        this.apiResponse = new ResponseResult();
        try {
            switch (idCarType){
                case '2':
                case '3':
                    this.apiResponse.data = [
                        { carSize: 'S' },
                        { carSize: 'M' },
                        { carSize: 'L' },
                    ]
                    break;
                case '4':
                case '5':
                    this.apiResponse.data = [
                        { carSize: 'S' },
                        { carSize: 'M' },
                    ]
                    break;
            }
        } catch (error) {
            this.apiResponse.status = HttpStatus.NOT_FOUND;
        }
        return this.apiResponse;
    }

    async calculateDistanceBetweenCarAndConsumer(searchCarByLocationDto: SearchCarByLocationDto, car: CarTypeEntity) {
        let dLat = Math.abs((searchCarByLocationDto.latitude - car.latitude) * (Math.PI / 180));
        let dLong = Math.abs((searchCarByLocationDto.longitude - car.longitude) * (Math.PI / 180));
        let la1ToRad = searchCarByLocationDto.latitude * (Math.PI / 180);
        let la2ToRad = car.latitude * (Math.PI / 180);

        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(la1ToRad) * Math.cos(la2ToRad) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371 * c;
    }

    async calculatePrice(distance: number, carId: string) {
        let totalPrice = 20; // platform fee
        switch (carId) {
            case "1": //Robinhood Taxi
                if (distance <= 1) {
                    totalPrice += 35;
                } else if (distance <= 10) {
                    totalPrice += 5.5 * (distance - 1);
                } else if (distance <= 20) {
                    totalPrice += 6.5 * (distance - 10);
                } else if (distance <= 40) {
                    totalPrice += 7.5 * (distance - 20);
                } else if (distance <= 60) {
                    totalPrice += 8 * (distance - 40);
                } else if (distance <= 80) {
                    totalPrice += 9 * (distance - 60);
                } else {
                    totalPrice += 10.5 * (distance - 80);
                }
                break;
            case "2": // Robinhood EV Car
            case "6": // Robinhood Car
            case "4": // Robinhood Lady
                if (distance <= 2) {
                    totalPrice += 45;
                } else if (distance <= 6) {
                    totalPrice += 8 * (distance - 2);
                } else if (distance <=39) {
                    totalPrice += 7 * (distance - 6);
                } else {
                    totalPrice += 10 * (distance - 39);
                }
                break;
            case "3": // Robinhood EV Car Premium
            case "5": // Robinhood Premium Car
            case "7": // Robinhood SUV
                if (distance <= 2) {
                    totalPrice += 110;
                } else {
                    totalPrice += 12 * (distance - 2);
                }
                break;
        }
        return totalPrice;
    }
}