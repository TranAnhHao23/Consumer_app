import {
    HttpException,
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
import { GetRecentFavoriteBookingDto } from './dto/get-recent-favorite-booking.dto';
import { NoteForDriverDto } from './dto/note-for-driver.dto';
import { SetLikeBookingDto } from './dto/set-like-booking.dto';
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
            // Validate Promotion
            
            const newobj = this.bookingRepository.create(createBookingDto);
            const getTrip = await this.tripRepository.findOne(createBookingDto.tripId);
            if (Object.keys(getTrip).length !== 0) {
                // @ts-ignore
                newobj.status = BookingStatus.PROCESSING;
                newobj.trip = getTrip;
                newobj.bookingStartTime = new Date(new Date().toUTCString());
                newobj.startTime = new Date();
                newobj.updatedAt = new Date();

                // Calculate price
                newobj.price = await this.calculatePrice(newobj.distance, getTrip.carType.toString());

                // Get promotion
                newobj.totalAmount =  newobj.price + newobj.tipAmount;

                this.apiResponse.data = await this.bookingRepository.save(newobj);

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
                booking.updatedAt = new Date();
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

    async setLike(id: string, setLikeBookingDto: SetLikeBookingDto) {
        this.apiResponse = new ResponseResult()
        try {
            const booking = await this.bookingRepository.findOne(id)
            if (!booking) {
                throw new HttpException('Booking not found', HttpStatus.NOT_FOUND)
            }
            await this.bookingRepository.update(id, { isLiked: setLikeBookingDto.isLike })
            this.apiResponse.status = HttpStatus.OK
            this.apiResponse.data = { id, isLiked: setLikeBookingDto.isLike }
        } catch (error) {
            if (error instanceof HttpException) {
                this.apiResponse.status = error.getStatus()
                this.apiResponse.errorMessage = error.getResponse().toString()
            } else {
                this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR
            }
        }
        return this.apiResponse
    }

    async getbyUserId(userId: string) {
        this.apiResponse = new ResponseResult();
        try {
            this.apiResponse.data = await this.bookingRepository.find({
                where: {userId: userId},
                order: {['createdAt']: 'DESC'},
                relations: ['trip', 'trip.locations','promotions'],
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
                order: {['createdAt']: 'DESC'},
                relations: ['trip', 'trip.locations','promotions'],
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
                order: {['createdAt']: 'DESC'},
                relations: ['trip', 'trip.locations','promotions'],
                take: top
            });
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async getRecentFavoriteBooking(getRecentFavoriteBookingDto: GetRecentFavoriteBookingDto) {
        this.apiResponse = new ResponseResult();

        try {
            const bookings = await this.bookingRepository.find({
                where: { 
                    userId: getRecentFavoriteBookingDto.userId,
                    status: BookingStatus.COMPLETED
                },
                relations: ['trip', 'trip.locations'],
                order: { isLiked: 'DESC', startTime: 'DESC' },
                take: getRecentFavoriteBookingDto.limit
            })
            this.apiResponse.data = bookings
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return this.apiResponse
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
                relations: ['trip', 'trip.locations','promotions'],
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
                relations: ['trip', 'trip.locations','promotions'],
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
            let cancelTimes = await this.bookingRepository.createQueryBuilder()
                .where('status = -1')
                .andWhere('user_Id = :userId', {userId: cancelBookingDto.userId})
                .andWhere('cancel_time > :earlierTime', {earlierTime: new Date(new Date().getTime() - 60*60*1000)})
                .andWhere('cancel_time < :laterTime', {laterTime: new Date()})
                .getCount();
            if(cancelTimes < 3) {
                if  (bookingCancel !== null && bookingCancel.status !== BookingStatus.CANCELED) {
                    bookingCancel.cancelReason = cancelBookingDto.cancelReason;
                    bookingCancel.status = BookingStatus.CANCELED;
                    bookingCancel.cancelTime = new Date();
                    await this.bookingRepository.update(bookingCancel.id,bookingCancel);
                    cancelTimes++;
                } else {
                    throw new HttpException("Couldn't find booking", HttpStatus.NOT_FOUND);
                }
            }
            if(cancelTimes == 3) {
                throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
            }
            this.apiResponse.data = {cancelTimes: cancelTimes};
        } catch (error) {
            this.apiResponse.status = HttpStatus.NOT_FOUND;
        }
        return this.apiResponse;
    }

    async noteForDriver(bookingId: string, noteForDriverDto: NoteForDriverDto) {
        this.apiResponse = new ResponseResult()
        try {
            const booking = await this.bookingRepository.findOne(bookingId)

            if (!booking) {
                throw new HttpException('Booking not found', HttpStatus.NOT_FOUND)
            }

            if (booking.status != BookingStatus.PROCESSING) {
                throw new HttpException('Booking is not proccessing. You can not update', HttpStatus.BAD_REQUEST)
            }
            await this.bookingRepository.update(bookingId, {
                noteForDriver: noteForDriverDto.noteForDriver
            })

            const updatedBooking = await this.bookingRepository.findOne(bookingId, { relations: ['trip' ]})
            this.apiResponse.status = HttpStatus.CREATED
            this.apiResponse.data = updatedBooking
        } catch (error) {
            if (error instanceof HttpException) {
                this.apiResponse.status = error.getStatus()
                this.apiResponse.errorMessage = error.getResponse().toString()
            } else {
                this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR
            }
        }
        return this.apiResponse
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
