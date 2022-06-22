import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseResult } from 'src/shared/ResponseResult';
import { createQueryBuilder, Repository } from 'typeorm';
import { TripEntity } from '../trips/entities/trip.entity';
import { CancelBookingDto } from './dto/CancelBookingDto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingEntity } from './entities/booking.entity';

enum BookingStatus {
  CANCELED =-1,
  APPROVED = 0,
  DECLINED = 1,
  PROCESSING = 2,
  COMPLETED = 3,
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    private readonly apiResponse: ResponseResult,
    @InjectRepository(TripEntity)
    private readonly tripRepository: Repository<TripEntity>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    this.apiResponse.status = HttpStatus.OK;
    try {
      const newobj = this.bookingRepository.create(createBookingDto);
       const getTrip = await this.tripRepository.findOne(createBookingDto.tripId);
       if(Object.keys(getTrip).length !== 0)
       {
        newobj.status = BookingStatus.PROCESSING;
        newobj.trip = getTrip;
        newobj.bookingStartTime = new Date(new Date().toUTCString()); 
        newobj.startTime = new Date(); 
        newobj.updateAt = new Date(); 

      // Calculate price
      
        this.apiResponse.data = await this.bookingRepository.save(newobj);

        // update trip = isDrafting = false
        getTrip.isDrafting = false;
        getTrip.updatedAt = new Date();
        await this.bookingRepository.update(newobj.id,newobj);
       }
        else
        throw new InternalServerErrorException();
    } catch (error) { 
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async cancelBooking(cancelBookingDto: CancelBookingDto) {
    this.apiResponse.status = HttpStatus.OK;
    try {
      var booking = await this.bookingRepository.findOne(cancelBookingDto.id);
       if(Object.keys(booking).length !== 0)
       {
        booking.cancelReason = cancelBookingDto.cancelReason;
        booking.updateAt = new Date(new Date().toUTCString()); 
        this.apiResponse.data = await this.bookingRepository.update(cancelBookingDto.id,booking);
       }
        else
        throw new InternalServerErrorException();
    } catch (error) { 
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    this.apiResponse.status = HttpStatus.OK;
    try {
      await this.bookingRepository.update({ id: id }, updateBookingDto);
      this.apiResponse.data = await this.bookingRepository.findOne({ id: id });
    } catch (error) {
      this.apiResponse.status = HttpStatus.NOT_FOUND;;
    }
    return this.apiResponse;
  }

  async getbyUserId(userId: string) {
    this.apiResponse.status = HttpStatus.OK;
    try {
      this.apiResponse.data = await this.bookingRepository.find({
        where: { userId: userId },
        order: { ['createAt']: 'DESC' },
        relations: ['trip','trip.locations'],
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async getBookingHistory(userId: string,top:number) {
    this.apiResponse.status = HttpStatus.OK;
    try {
      this.apiResponse.data = await this.bookingRepository.find({
        where: { userId: userId },
        order: { ['createAt']: 'DESC' },
        relations: ['trip','trip.locations'],
        take:top
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async getFavouriteBooking(userId: string,top:number) {
    this.apiResponse.status = HttpStatus.OK;
    try {
      this.apiResponse.data = await this.bookingRepository.find({
        where: { userId: userId },
        order: { ['createAt']: 'DESC' },
        relations: ['trip','trip.locations'],
        take:top
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async findOne(id: string) {
    this.apiResponse.status = HttpStatus.OK;
    try {
      this.apiResponse.data = await this.bookingRepository.findOne(id, {
        relations: ['trip','trip.locations'],
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async remove(id: string) {
    this.apiResponse.status = HttpStatus.OK;
    try {
      await this.bookingRepository.delete(id);
    } catch (error) {
      this.apiResponse.status = HttpStatus.NOT_FOUND;
    }
    return this.apiResponse;
  }

  // async getBookingHistory(deviceId: string) {
  //   try {
  //     const query = await this.bookingRepository
  //       .createQueryBuilder('booking')
  //       .innerJoinAndSelect('booking.trip', 'trip')
  //       .where('device_id = :id', { id: deviceId })
  //       .orderBy('createdAt', 'DESC')
  //       .getMany();
  //     console.log(query);
  //     this.apiResponse.data = query;
  //   } catch (error) {
  //     this.apiResponse.errorMessage = error;
  //     this.apiResponse.status = HttpStatus.NOT_FOUND;
  //   }
  //   return this.apiResponse;
  // }
}
