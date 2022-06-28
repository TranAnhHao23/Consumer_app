import {
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ResponseResult} from 'src/shared/ResponseResult';
import {createQueryBuilder, In, Repository} from 'typeorm';
import {TripEntity} from '../trips/entities/trip.entity';
import {CancelBookingDto} from './dto/CancelBookingDto';
import {CreateBookingDto} from './dto/create-booking.dto';
import {UpdateBookingDto} from './dto/update-booking.dto';
import {BookingEntity} from './entities/booking.entity';
import {CancelReason} from "./entities/cancel-reason.entity";
import {EmergencyCall} from "./entities/emergency-call.entity";

enum BookingStatus {
    CANCELED = -1,
    PROCESSING = 0,
    COMPLETED = 1,
}

enum TrackingStatus {
    DRIVER_NOT_FOUND= -1, //ไม่พบคนขับในขณะนี้
    DRIVER_ACCEPT = 0, // พบคนขับแล้ว
    DRIVER_TO_PICKUP = 1, // คนขับใกล้ถึงแล้ว
    DRIVER_ARRIVE= 2, // คนขับมาถึงแล้ว
    ON_PROGRESS = 3, // กำลังเดินทาง
    ARRIVE_DESTINATION = 4, // ถึงจุดหมายแล้ว
}

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(BookingEntity)
        private readonly bookingRepository: Repository<BookingEntity>,
        private apiResponse: ResponseResult,
        @InjectRepository(TripEntity)
        private readonly tripRepository: Repository<TripEntity>,
    ) {
    }

    async create(createBookingDto: CreateBookingDto) {
        this.apiResponse = new ResponseResult();
        try {
            const newobj = this.bookingRepository.create(createBookingDto);
            const getTrip = await this.tripRepository.findOne(createBookingDto.tripId);
            if (Object.keys(getTrip).length !== 0) {
                // @ts-ignore
                newobj.status = BookingStatus.PROCESSING;
                newobj.trip = getTrip;
                newobj.bookingStartTime = new Date(new Date().toUTCString());
                newobj.startTime = new Date();
                newobj.updateAt = new Date();

                // Calculate price
                newobj.price = await this.calculatePrice(newobj.distance, getTrip.carType.toString());

                this.apiResponse.data = await this.bookingRepository.save(newobj);

                // this.apiResponse.data =  await this.bookingRepository.update(newobj.id,newobj);

                // update trip = isDrafting = false
                getTrip.isDrafting = false;
                getTrip.updatedAt = new Date();
                await this.tripRepository.update(getTrip.id, getTrip);
            } else
                throw new InternalServerErrorException();
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
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
                } else if (distance <= 39) {
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

    async cancelBooking(cancelBookingDto: CancelBookingDto) {
        this.apiResponse = new ResponseResult();
        try {
            var booking = await this.bookingRepository.findOne(cancelBookingDto.id);
            if (Object.keys(booking).length !== 0) {
                booking.cancelReason = cancelBookingDto.cancelReason;
                booking.status = BookingStatus.CANCELED;
                booking.updateAt = new Date();
                this.apiResponse.data = await this.bookingRepository.update(cancelBookingDto.id, booking);
            } else
                throw new InternalServerErrorException();
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async update(id: string, updateBookingDto: UpdateBookingDto) {
        this.apiResponse = new ResponseResult();
        try {
            await this.bookingRepository.update({id: id}, updateBookingDto);
            this.apiResponse.data = await this.bookingRepository.findOne({id: id});
        } catch (error) {
            this.apiResponse.status = HttpStatus.NOT_FOUND;
            ;
        }
        return this.apiResponse;
    }

    async getbyUserId(userId: string) {
        this.apiResponse = new ResponseResult();
        try {
            this.apiResponse.data = await this.bookingRepository.find({
                where: {userId: userId},
                order: {['createAt']: 'DESC'},
                relations: ['trip', 'trip.locations'],
            });
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async getCancelBooking(userId: string, top: number) {
        this.apiResponse = new ResponseResult();
        if (top == 0)
            top = 5;
        try {
            this.apiResponse.data = await this.bookingRepository.find({
                where: {userId: userId, status: BookingStatus.CANCELED},
                order: {['createAt']: 'DESC'},
                relations: ['trip', 'trip.locations'],
                take: top
            });
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async getBookingHistory(userId: string, top: number) {
        this.apiResponse = new ResponseResult();
        if (top == 0)
            top = 5;
        try {
            this.apiResponse.data = await this.bookingRepository.find({
                where: {userId: userId},
                order: {['createAt']: 'DESC'},
                relations: ['trip', 'trip.locations'],
                take: top
            });
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }


    async getFavouriteBooking(userId: string, top: number) {
        this.apiResponse = new ResponseResult();
        try {
            const tripIds = await this.tripRepository.createQueryBuilder('trip')
                .innerJoinAndSelect('booking', 'booking', 'booking.trip_id = trip.id')
                .select('trip.id')
                .groupBy('trip.id')
                .where('booking.user_Id = :user_Id', {user_Id: userId})
                .orderBy({'sum(trip.copy_trip_id)': 'DESC', 'trip.createdat': 'DESC'})
                .limit(top)
                .getMany()

            // Get booking by tripId
            const query = await this.bookingRepository.find({
                relations: ['trip', 'trip.locations'],
                where: {
                    'trip': {id: In(tripIds.map(ele => ele.id))},
                },
            });

            this.apiResponse.data = query;
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async findOne(id: string) {
        this.apiResponse = new ResponseResult();
        try {
            this.apiResponse.data = await this.bookingRepository.findOne(id, {
                relations: ['trip', 'trip.locations'],
            });
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async remove(id: string) {
        this.apiResponse = new ResponseResult();
        try {
            await this.bookingRepository.delete(id);
        } catch (error) {
            this.apiResponse.status = HttpStatus.NOT_FOUND;
        }
        return this.apiResponse;
    }

    async getCancelReasonList() {
        this.apiResponse = new ResponseResult();
        try {
            // It's possible if we đon't use reason# to be a keys
            this.apiResponse.data = Object.keys(CancelReason).map(key => CancelReason[key]);
        } catch (error) {
            this.apiResponse.status = HttpStatus.NOT_FOUND;
        }
        return this.apiResponse;
    }

    async cancelBooking2 (cancelBookingDto: CancelBookingDto) {
        this.apiResponse = new ResponseResult();
        try {
            let bookingCancel = await this.bookingRepository.findOne(cancelBookingDto.id);
            if  (bookingCancel !== null && bookingCancel.status !== BookingStatus.CANCELED) {
                bookingCancel.cancelReason = cancelBookingDto.cancelReason;
                bookingCancel.status = BookingStatus.CANCELED;
                await this.bookingRepository.update(bookingCancel.id,bookingCancel);
                this.apiResponse.data = bookingCancel;
            } else {
                throw new InternalServerErrorException();
            }
        } catch (error) {
            this.apiResponse.status = HttpStatus.NOT_FOUND;
        }
        return this.apiResponse;
    }

    async getEmergencyInformation() {
        this.apiResponse = new ResponseResult()
        try {
            this.apiResponse.data = EmergencyCall.PHONE_NUMBER;
        } catch (error) {
            this.apiResponse.status = HttpStatus.NOT_FOUND;
        }
        return this.apiResponse;
    }


}
