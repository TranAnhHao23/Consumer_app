import {
    HttpException,
    HttpStatus,
    Injectable,
    InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid'

import { InjectRepository } from '@nestjs/typeorm';
import { ResponseResult } from 'src/shared/ResponseResult';
import { LessThan, MoreThan, Repository } from 'typeorm';
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
import { AcceptBookingDto } from './dto/accept-booking.dto';
import { CarEntity } from '../car/entities/car.entity';
import { DriverEntity } from '../driver/entities/driver.entity';
import { PaymentMethod } from '../paymentmethod/entities/paymentmethod.entity';
import {HttpService} from "@nestjs/axios";
import {firstValueFrom, lastValueFrom, map, Observable} from "rxjs";
import {SearchingDriverDto} from "./dto/searching-driver.dto";
import {DriverAppFindDriverRequestDto} from "./dto/DriverApp-FindDriver-Request.dto";
import {response} from "express";
import {DriverAppFindDriverResponseDto} from "./dto/DriverApp-FindDriver-Response.dto";
import { DriverAppCancelTripDto } from './dto/DriverApp-Cancel-Trip.dto';
import { DriverAppConfirmPickupPassengerDto } from './dto/DriverApp-Confirm-Pickup-Passenger.dto';
import { DriverAppFinishTripDto } from './dto/DriverApp-Finish-Trip.dto';
import { NotFoundError } from 'rxjs';
import { BookingStatus } from './entities/booking.entity';
import {GetRatingReasonsDto} from "./dto/Get-Rating-Reasons.dto";
import {SubmitRatingDto} from "./dto/Submit-Rating.dto";

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
        @InjectRepository(CarEntity)
        private readonly carRepo: Repository<CarEntity>,
        @InjectRepository(DriverEntity)
        private readonly driverRepo: Repository<DriverEntity>,
        @InjectRepository(PaymentMethod)
        private readonly paymentMethodRepository: Repository<PaymentMethod>,
        private readonly httpService: HttpService
    ) {
    }

    async checkBookingAvailability(userId: string) {
        const apiResponse = new ResponseResult
        try {
            const booking = await this.bookingRepository.createQueryBuilder('booking')
                .innerJoin('trip', 'trip')
                .where({ userId: userId })
                .andWhere(`trip.startTime is null`)
                .andWhere(`booking.status IN (${[BookingStatus.PENDING, BookingStatus.WAITING, BookingStatus.PROCESSING]})`)
                .orderBy({ 'booking.updatedAt': 'DESC' })
                .getOne()

            if (booking) {
                apiResponse.data = {
                    isAvailable: false,
                    booking: booking
                }
                throw new HttpException('A booking is in progress', HttpStatus.NOT_ACCEPTABLE)
            }

            const cancelBookingsInHour = await this.bookingRepository.find({
                where: {
                    userId: userId,
                    status: BookingStatus.CANCELED,
                    cancelTime: MoreThan(new Date(new Date().getTime() - 60 * 60 * 1000))
                },
                order: { cancelTime: 'DESC' }
            })

            if (cancelBookingsInHour.length >= 3) {
                apiResponse.data = {
                    isAvailable: false,
                    lockTo: new Date(new Date(cancelBookingsInHour[0].cancelTime).getTime() + 3 * 60 * 60 * 1000)
                }
                throw new HttpException('Your account is locked because of canceling booking too 3 times in an hour', HttpStatus.NOT_ACCEPTABLE)
            }

            apiResponse.data = {
                isAvailable: true
            }
            
        } catch (error) {
            apiResponse.status = error.status
            apiResponse.errorMessage = error instanceof HttpException ? error.message : 'INTERNAL_SERVER_ERROR'
        }
        return apiResponse
    }

    async create(createBookingDto: CreateBookingDto) {
        this.apiResponse = new ResponseResult(HttpStatus.CREATED);
        try {
            // Validate Promotion
            const newobj = this.bookingRepository.create(createBookingDto);
            const getTrip = await this.tripRepository.findOne(createBookingDto.tripId);
            if (Object.keys(getTrip).length !== 0) {
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

    async update(id: string, updateBookingDto: UpdateBookingDto) {
        this.apiResponse = new ResponseResult(HttpStatus.CREATED);
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
                relations: ['driverInfo', 'carInfo','paymentMethod', 'trip', 'trip.locations', 'promotions'],
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
        this.apiResponse = new ResponseResult(HttpStatus.CREATED);
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

            if (booking.status != BookingStatus.PENDING) {
                throw new HttpException('Booking is in proccess or completed. You can not update', HttpStatus.BAD_REQUEST)
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

    async acceptBooking(id: string, acceptBookingDto: AcceptBookingDto) {
        this.apiResponse = new ResponseResult()
        try {
            const booking = await this.bookingRepository.findOne(id, { relations: ['trip'] })

            const setCarId = uuidv4();
            const setDriverId = uuidv4();
            await this.bookingRepository.update(id, {
                driverAppBookingId: uuidv4(),
                status: BookingStatus.WAITING,
                carId: setCarId,
                driverId: setDriverId
            })

            if (!booking) {
                throw new HttpException('Booking not found', HttpStatus.NOT_FOUND)
            }

            if (booking.status != BookingStatus.PENDING) {
                throw new HttpException('This booking is no longer available to accept', HttpStatus.BAD_REQUEST)
            }

            // Check status and throw exception can not accept

            // const existDriverAndCar = await Promise.all([
            //     this.driverRepo.findOne({
            //         booking: booking
            //     }),
            //     this.carRepo.findOne({
            //         booking: booking
            //     })
            // ])

            // if (existDriverAndCar[0] || existDriverAndCar[1]) {
            //     throw new HttpException('This booking has been accepted or taken by another', HttpStatus.BAD_REQUEST)
            // }

            await Promise.all([
                this.driverRepo.delete({ booking: booking }),
                this.carRepo.delete({ booking: booking })
            ])

            const car = this.carRepo.create({
                carId: setCarId,
                carTypeId: booking.trip.carType + '',
                icon: "https://i.ibb.co/JcSvbzQ/image-2022-07-01-T08-57-48-034-Z.png",
                size: "M",
                licensePlateNumber: "29A-957.54",
                branch: "Vinfast",
                color: "Pink",
                region: "Hanoi",
                booking: booking
                // carId: acceptBookingDto.carInfo.carId,
                // carTypeId: acceptBookingDto.carInfo.carTypeId,
                // icon: acceptBookingDto.carInfo.icon,
                // size: acceptBookingDto.carInfo.size,
                // licensePlateNumber: acceptBookingDto.carInfo.licensePlateNumber,
                // branch: acceptBookingDto.carInfo.branchName,
                // color: acceptBookingDto.carInfo.color,
                // region: acceptBookingDto.carInfo.regionRegister,
                // booking: booking
            })

            const driver = this.driverRepo.create({
                driverId: setDriverId,
                name: "Peter Parker",
                avatar: "https://i.ibb.co/7YK1Nkr/image-2022-07-06-T03-44-13-236-Z.png",
                phoneNum: "0377256985",
                rating: 4.8,
                latitude: acceptBookingDto.driverInfo.latitude,
                longitude: acceptBookingDto.driverInfo.longitude,
                booking: booking
                // driverId: acceptBookingDto.driverInfo.driverId,
                // name: acceptBookingDto.driverInfo.name,
                // avatar: acceptBookingDto.driverInfo.avatar,
                // phoneNum: acceptBookingDto.driverInfo.phoneNumber,
                // rating: acceptBookingDto.driverInfo.rating,
                // latitude: acceptBookingDto.driverInfo.latitude,
                // longitude: acceptBookingDto.driverInfo.longitude,
                // booking: booking

            })

            await Promise.all([driver.save(), car.save()])

            const updatedBooking = await this.bookingRepository.findOne(id, {
                relations: ['trip', 'trip.locations', 'driverInfo', 'carInfo']
            })

            this.apiResponse.data = updatedBooking

        } catch (error) {
            console.log(error)
            if (error instanceof HttpException) {
                this.apiResponse.status = error.getStatus()
                this.apiResponse.errorMessage = error.getResponse().toString()
            } else {
                this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR
            }
        }

        return this.apiResponse
    }

    // Update Booking Status
    async cancelTrip(driverAppCancelTripDto: DriverAppCancelTripDto) {
        this.apiResponse = new ResponseResult(HttpStatus.CREATED);
        try {
            // const booking = await this.bookingRepository.findOne({
            //     //where: { driverAppBookingId: driverAppBookingDto.booking_id }
            //     // for testing
            //     where: { id: driverAppBookingDto.booking_id }
            // });

            // for testing
            const booking = await this.bookingRepository.findOne(driverAppCancelTripDto.booking_id);

            if (Object.keys(booking).length !== 0) {
                booking.cancelReason = driverAppCancelTripDto.cancelReason;
                booking.status = BookingStatus.CANCELED;
                booking.updatedAt = new Date();
                booking.cancelTime = new Date();
                await this.bookingRepository.update(booking.id, booking);

                // Update long lat driver for testing
                if (booking.driverId != null) {
                    const driverInfo = await this.driverRepo.findOne({
                        where: { driverId: booking.driverId }
                    });
                    if (Object.keys(driverInfo).length !== 0) {
                        driverInfo.longitude = driverAppCancelTripDto.longitude;
                        driverInfo.latitude = driverAppCancelTripDto.latitude
                        await this.driverRepo.update(driverInfo.id, driverInfo);
                    }
                }
                this.apiResponse.data = await this.findBookingById(driverAppCancelTripDto.booking_id);
                // calculate booking promotion
                // await this.calculatePromotion(booking, null);
            } else
                throw new NotFoundException();
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                this.apiResponse.status = error.getStatus()
                this.apiResponse.errorMessage = error.getResponse().toString()
            } else {
                this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR
            }
        }
        return this.apiResponse;
    }

    // Update Booking Status
    async finishtrip(driverAppFinishTripDto: DriverAppFinishTripDto) {
        this.apiResponse = new ResponseResult(HttpStatus.CREATED);
        try {
            // const booking = await this.bookingRepository.findOne({
            //     //where: { driverAppBookingId: driverAppBookingDto.booking_id }
            //     // for testing
            //     where: { id: driverAppBookingDto.booking_id }
            // });

            // for testing
            const booking = await this.bookingRepository.findOne(driverAppFinishTripDto.booking_id);

            if (Object.keys(booking).length !== 0) {
                booking.status = BookingStatus.COMPLETED;
                booking.arrivedTime = new Date();
                booking.updatedAt = new Date();
                booking.waitingFreeAmount = driverAppFinishTripDto.waiting_free_amount;
                booking.waitingFreeNote = driverAppFinishTripDto.waiting_free_note;
                await this.bookingRepository.update(booking.id, booking);

                // Update long lat driver for testing
                if (booking.driverId != null) {
                    const driverInfo = await this.driverRepo.findOne({
                        where: { driverId: booking.driverId }
                    });
                    if (Object.keys(driverInfo).length !== 0) {
                        driverInfo.longitude = driverAppFinishTripDto.longitude;
                        driverInfo.latitude = driverAppFinishTripDto.latitude
                        await this.driverRepo.update(driverInfo.id, driverInfo);
                    }
                }
                this.apiResponse.data = await this.findBookingById(driverAppFinishTripDto.booking_id);

                // calculate booking promotion
                // await this.calculatePromotion(booking, null);
            } else
                throw new NotFoundException();
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                this.apiResponse.status = error.getStatus();
                this.apiResponse.errorMessage = error.getResponse().toString();
            } else {
                this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        }
        return this.apiResponse;
    }

    // Update Booking Status
    async confirmPickupPassenger(driverAppConfirmPickupPassengerDto: DriverAppConfirmPickupPassengerDto) {
        this.apiResponse = new ResponseResult(HttpStatus.CREATED);
        try {
            // const booking = await this.bookingRepository.findOne({
            //     //where: { driverAppBookingId: driverAppBookingDto.booking_id }
            //     // for testing
            //     where: { id: driverAppBookingDto.booking_id }
            // });

            // for testing
            const booking = await this.bookingRepository.findOne(driverAppConfirmPickupPassengerDto.booking_id);

            if (Object.keys(booking).length !== 0) {
                booking.status = BookingStatus.PROCESSING;
                booking.startTime = new Date();
                //booking.updatedAt = new Date();
                await this.bookingRepository.update(booking.id, booking);

                // Update long lat driver for testing
                if (booking.driverId != null) {
                    const driverInfo = await this.driverRepo.findOne({
                        where: { driverId: booking.driverId }
                    });
                    if (Object.keys(driverInfo).length !== 0) {
                        driverInfo.longitude = driverAppConfirmPickupPassengerDto.longitude;
                        driverInfo.latitude = driverAppConfirmPickupPassengerDto.latitude
                        await this.driverRepo.update(driverInfo.id, driverInfo);
                    }
                }
                this.apiResponse.data = await this.findBookingById(driverAppConfirmPickupPassengerDto.booking_id);

                // calculate booking promotion
                // await this.calculatePromotion(booking, null);
            } else
                throw new NotFoundException();
        } catch (error) {
            console.log(error);
            if (error instanceof HttpException) {
                this.apiResponse.status = error.getStatus();
                this.apiResponse.errorMessage = error.getResponse().toString();
            } else {
                this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        }
        return this.apiResponse;
    }

    async findBookingById(id: string) {
        return await this.bookingRepository.findOne(id, {
            relations: ['driverInfo', 'carInfo', 'paymentMethod', 'trip', 'trip.locations', 'promotions'],
        });
    }

    async findDriver(searchingDriverDto: SearchingDriverDto) {
        this.apiResponse = new ResponseResult(HttpStatus.CREATED);
        // send data to FE
        let trip = await this.tripRepository.findOne({id: searchingDriverDto.tripId}, {relations:['locations']});
        let totalAmount = await this.calculatePrice(searchingDriverDto.distance, String(trip.carType));
        let driverAppFindDriverRequest: DriverAppFindDriverRequestDto = {
            depLong: trip.locations[0].longitude,
            depLat: trip.locations[0].longitude,
            desLong1: trip.locations[1].longitude,
            desLat1: trip.locations[1].latitude,
            desLong2: (trip.locations[2]!== undefined)? trip.locations[2].longitude : undefined,
            desLat2: (trip.locations[2]!== undefined)? trip.locations[2].latitude : undefined,
            desLong3: (trip.locations[3]!== undefined)? trip.locations[3].longitude : undefined,
            desLat3: (trip.locations[3]!== undefined)? trip.locations[3].latitude : undefined,
            distance: searchingDriverDto.distance,
            carTypeId: String(trip.carType)
        };
        let paymentMethod = await this.paymentMethodRepository.findOne({id: searchingDriverDto.paymentMethodId})

        this.apiResponse.data = [{
            driver: driverAppFindDriverRequest,
            locations: trip.locations,
            paymentMethod: paymentMethod,
            totalAmount: totalAmount
        }]
        // send API driver app
        // let searchingStatus = await this.sendFindDriverToDriverApp(searchingDriverDto.api, driverAppFindDriverRequest)
        // if (!searchingStatus) {
        //     this.apiResponse.status = HttpStatus.NOT_FOUND
        // }
        return this.apiResponse;
    }

    async sendFindDriverToDriverApp(url: string, driverAppFindDriverRequest: DriverAppFindDriverRequestDto) {
        // Send request data to driver app
        const data = await this.handleExternalPostApi(url, driverAppFindDriverRequest);
        if (Object.keys(data).length == 2) {
            return false;
        }
        return true;
    }

    async handleExternalGetApi(api: string) {
        const {data} = await firstValueFrom(this.httpService.get(api))
        return data;
    }

    async handleExternalPostApi(api, data: any){
        const res = await firstValueFrom(this.httpService.post(api, data)
            .pipe(
            map((response) => {
                return response.data;
            })
        ));
        return res;
    }

    async getRatingReasons(getRatingReasonsDto: GetRatingReasonsDto){
        const apiResponse = new ResponseResult();
        try {
            let booking = await this.bookingRepository.findOne(getRatingReasonsDto.bookingId, {
                relations: ['driverInfo', 'carInfo','paymentMethod', 'trip', 'trip.locations', 'promotions'],
            });
            apiResponse.data = {
                driverInfo: booking.driverInfo,
                reviews: [],
                tipAmounts: [10, 20, 30, 50]
            }
            if (+getRatingReasonsDto.rating == 0) {

            } else if (+getRatingReasonsDto.rating <= 3) {
                apiResponse.data.reviews = ['แต่งกายไม่สุภาพ', 'คนขับไม่สุภาพ', 'ไม่ให้ความช่วยเหลือ', 'รถไม่สะอาด', 'ขับรถไม่ปลอดภัย', 'คนขับไม่ตรงโปรไฟล์', 'ทะเบียนรถไม่ถูกต้อง'];
            } else if (+getRatingReasonsDto.rating <=5) {
                apiResponse.data.reviews = ['แต่งกายสุภาพ', 'มารยาทดี', 'ให้ความช่วยเหลือดี', 'รถสะอาด', 'ขับรถดี'];
            }
        } catch (error) {
            apiResponse.status = error.status;
            apiResponse.errorMessage = error.message;
        }
        return apiResponse;
    }

    async submitRating(submitRating: SubmitRatingDto) {
        const apiResponse = new ResponseResult();
        try {
            console.log(submitRating.ratingReasons)
            apiResponse.data = 'Submit reviews into Driver App';
        } catch (error) {
            apiResponse.status = error.status;
            apiResponse.errorMessage = error.message;
        }
        // saving driver reviews
        return apiResponse;
    }
}
