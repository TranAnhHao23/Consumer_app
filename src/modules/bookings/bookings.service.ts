import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { ResponseResult } from 'src/shared/ResponseResult';
import { createQueryBuilder, In, Repository } from 'typeorm';
import { TripEntity } from '../trips/entities/trip.entity';
import { CancelBookingDto } from './dto/CancelBookingDto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetRecentFavoriteBookingDto } from './dto/get-recent-favorite-booking.dto';
import { NoteForDriverDto } from './dto/note-for-driver.dto';
import { SetLikeBookingDto } from './dto/set-like-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingEntity } from './entities/booking.entity';
import { CancelReason } from "./entities/cancel-reason.entity";
import { EmergencyCall } from "./entities/emergency-call.entity";
import { TrackingDto } from "./dto/tracking.dto";
import { Promotion } from '../promotion/entities/promotion.entity';
import { CreateBookingPromotion } from './dto/Create-booking-promotion';
import { PaymentMethod } from '../paymentmethod/entities/paymentmethod.entity';
import { DriverAppBookingDto } from './dto/DriverApp-BookingDto';

export enum BookingStatus {
    CANCELED = -1,
    PROCESSING = 0,
    COMPLETED = 1,
}

enum TrackingStatus {
    SEARCHING_DRIVER = 0, // กำลังค้นหาคนขับ...
    DRIVER_NOT_FOUND = 1, //ไม่พบคนขับในขณะนี้
    DRIVER_ACCEPT = 2, // พบคนขับแล้ว
    DRIVER_TO_PICKUP = 3, // คนขับใกล้ถึงแล้ว
    DRIVER_ARRIVE = 4, // คนขับมาถึงแล้ว
    ON_PROGRESS = 5, // กำลังเดินทาง
    ARRIVE_DESTINATION = 6, // ถึงจุดหมายแล้ว 
}

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(BookingEntity)
        private readonly bookingRepository: Repository<BookingEntity>,
        private apiResponse: ResponseResult,
        @InjectRepository(TripEntity)
        private readonly tripRepository: Repository<TripEntity>,
        @InjectRepository(Promotion)
        private readonly promotionRepository: Repository<Promotion>,
        @InjectRepository(PaymentMethod)
        private readonly paymentMethodRepository: Repository<PaymentMethod>,
    ) {
    }

    async create(createBookingDto: CreateBookingDto) {
        this.apiResponse = new ResponseResult(HttpStatus.CREATED);
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

                // Add payment method
                const getPaymentMethod = await this.paymentMethodRepository.findOne(createBookingDto.paymentMethodId);
                if (Object.keys(getPaymentMethod).length !== 0) {
                    newobj.paymentMethod = getPaymentMethod;
                } else {
                    this.apiResponse.status = HttpStatus.NOT_FOUND;
                    this.apiResponse.errorMessage = "Payment method is required";
                    return this.apiResponse;
                }

                const addBooking = await this.bookingRepository.save(newobj);

                // update trip = isDrafting = false
                getTrip.isDrafting = false;
                getTrip.updatedAt = new Date();
                await this.tripRepository.update(getTrip.id, getTrip);


                // calculate booking promotion
                // await this.calculatePromotion(addBooking, createBookingDto.promotions);

                this.apiResponse.data = addBooking;

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
                const getbooking = await this.bookingRepository.update(cancelBookingDto.id, booking);

                // calculate booking promotion
                // await this.calculatePromotion(booking, null);
                this.apiResponse.data = getbooking;
            } else
                throw new InternalServerErrorException();
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    // TODO
    // driverApp accept booking
    async driverAcceptBooking(driverAppBookingDto: DriverAppBookingDto) {
        this.apiResponse = new ResponseResult();
        try {
            const booking = await this.bookingRepository.findOne({
                where: { driverAppBookingId: driverAppBookingDto.driverAppBookingId }
            });

            if (Object.keys(booking).length !== 0) {
                booking.cancelReason = driverAppBookingDto.cancelReason;
                booking.status = BookingStatus.CANCELED;
                booking.updatedAt = new Date();
                const getbooking = await this.bookingRepository.update(booking.id, booking);

                // calculate booking promotion
                // await this.calculatePromotion(booking, null);
                this.apiResponse.data = getbooking;
            } else
                throw new InternalServerErrorException();
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }



    // driverApp cancel booking
    async driverAppcancelBooking(driverAppBookingDto: DriverAppBookingDto) {
        this.apiResponse = new ResponseResult();
        try {
            const booking = await this.bookingRepository.findOne({
                where: { driverAppBookingId: driverAppBookingDto.driverAppBookingId }
            });

            if (Object.keys(booking).length !== 0) {
                booking.cancelReason = driverAppBookingDto.cancelReason;
                booking.status = BookingStatus.CANCELED;
                booking.updatedAt = new Date();
                const getbooking = await this.bookingRepository.update(booking.id, booking);

                // calculate booking promotion
                // await this.calculatePromotion(booking, null);
                this.apiResponse.data = getbooking;
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
            const cvobj = this.bookingRepository.create(updateBookingDto);

            // check payment method
            const getPaymentMethod = await this.paymentMethodRepository.findOne(updateBookingDto.paymentMethodId);
            if (Object.keys(getPaymentMethod).length === 0) {
                this.apiResponse.status = HttpStatus.NOT_FOUND;
                this.apiResponse.errorMessage = "Payment method is required";
                return this.apiResponse;
            }
            else
                cvobj.paymentMethod = getPaymentMethod;

            await this.bookingRepository.update({ id: id }, cvobj);
            const getbooking = await this.bookingRepository.findOne({ id: id });

            // calculate booking promotion
            //await this.calculatePromotion(getbooking, updateBookingDto.promotions);

            this.apiResponse.data = getbooking;
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    // reset Promotion when user, update, cancel booking
    async calculatePromotion(booking: BookingEntity, promotions: CreateBookingPromotion[]) {
        this.apiResponse = new ResponseResult();
        try {
            // get all Promotion by bookingId
            // update this booking = null
            const allPromotions = await this.promotionRepository.find({
                where: { booking: booking.id }
            });

            if (allPromotions != null && allPromotions.length > 0)
                for (const element of allPromotions) {
                    element.booking = null;
                    await this.promotionRepository.update(element.id, element);
                }

            // re add booking
            if (promotions !== null && promotions.length > 0)
                for (const promo of promotions) {
                    const getPromo = await this.promotionRepository.findOne({ where: { userId: promo.userId, id: promo.id, code: promo.code } });
                    if (Object.keys(getPromo).length !== 0) {
                        getPromo.booking = booking;
                        await this.promotionRepository.update(getPromo.id, getPromo);
                    }
                }
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
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
                where: { userId: userId },
                order: { ['createdAt']: 'DESC' },
                relations: ['paymentMethod', 'trip', 'trip.locations', 'promotions'],
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
                where: { userId: userId, status: BookingStatus.CANCELED },
                order: { ['createdAt']: 'DESC' },
                relations: ['paymentMethod', 'trip', 'trip.locations', 'promotions'],
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
                where: { userId: userId },
                order: { ['createdAt']: 'DESC' },
                relations: ['paymentMethod', 'trip', 'trip.locations', 'promotions'],
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
                relations: ['paymentMethod', 'trip', 'trip.locations'],
                order: { isLiked: 'DESC', startTime: 'DESC' },
                take: getRecentFavoriteBookingDto.limit
            })
            this.apiResponse.data = bookings
        } catch (error) {
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }

        return this.apiResponse
    }


    // async getFavouriteBooking(userId: string, top: number) {
    //     this.apiResponse = new ResponseResult();
    //     try {
    //         const tripIds = await this.tripRepository.createQueryBuilder('trip')
    //             .innerJoinAndSelect('booking', 'booking', 'booking.trip_id = trip.id')
    //             .select('trip.id')
    //             .groupBy('trip.id')
    //             .where('booking.user_Id = :user_Id', {user_Id: userId})
    //             .orderBy({'sum(trip.copy_trip_id)': 'DESC', 'trip.createdat': 'DESC'})
    //             .limit(top)
    //             .getMany()

    //         // Get booking by tripId
    //         const query = await this.bookingRepository.find({
    //             relations: ['trip', 'trip.locations','promotions'],
    //             where: {
    //                 'trip': {id: In(tripIds.map(ele => ele.id))},
    //             },
    //         });

    //         this.apiResponse.data = query;
    //     } catch (error) {
    //         this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    //     }
    //     return this.apiResponse;
    // }

    async findOne(id: string) {
        this.apiResponse = new ResponseResult();
        try {
            this.apiResponse.data = await this.bookingRepository.findOne(id, {
                relations: ['paymentMethod', 'trip', 'trip.locations', 'promotions'],
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

    async cancelBooking2(cancelBookingDto: CancelBookingDto) {
        this.apiResponse = new ResponseResult();
        try {
            let bookingCancel = await this.bookingRepository.findOne(cancelBookingDto.id);
            let cancelTimes = await this.bookingRepository.createQueryBuilder()
                .where('status = -1')
                .andWhere('user_Id = :userId', { userId: cancelBookingDto.userId })
                .andWhere('cancel_time > :earlierTime', { earlierTime: new Date(new Date().getTime() - 60 * 60 * 1000) })
                .andWhere('cancel_time < :laterTime', { laterTime: new Date() })
                .getCount();
            if (cancelTimes < 3) {
                if (bookingCancel !== null && bookingCancel.status !== BookingStatus.CANCELED) {
                    bookingCancel.cancelReason = cancelBookingDto.cancelReason;
                    bookingCancel.status = BookingStatus.CANCELED;
                    bookingCancel.cancelTime = new Date();
                    await this.bookingRepository.update(bookingCancel.id, bookingCancel);
                    cancelTimes++;
                } else {
                    throw new HttpException("Couldn't find booking", HttpStatus.NOT_FOUND);
                }
            }
            if (cancelTimes == 3) {
                throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
            }
            this.apiResponse.data = { cancelTimes: cancelTimes };
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

            const updatedBooking = await this.bookingRepository.findOne(bookingId, { relations: ['trip'] })
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

    async getTrackingStatus() {
        // this.apiResponse = new ResponseResult();
        // try {
        //     switch ()
        // } catch (error) {
        //     this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        // }
        // return this.apiResponse;
    }
}
