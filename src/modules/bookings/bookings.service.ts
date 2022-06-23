import {
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
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingEntity } from './entities/booking.entity';

enum BookingStatus {
  CANCELED =-1, 
  PROCESSING = 0,
  COMPLETED = 1,
}

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    private apiResponse: ResponseResult,
    @InjectRepository(TripEntity)
    private readonly tripRepository: Repository<TripEntity>,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    this.apiResponse = new ResponseResult();
    try {
      const newobj = this.bookingRepository.create(createBookingDto);
       const getTrip = await this.tripRepository.findOne(createBookingDto.tripId);
       if(Object.keys(getTrip).length !== 0)
       {
         // @ts-ignore
         newobj.status = BookingStatus.PROCESSING;
        newobj.trip = getTrip;
        newobj.bookingStartTime = new Date(new Date().toUTCString()); 
        newobj.startTime = new Date(); 
        newobj.updateAt = new Date(); 

      // Calculate price
      
        this.apiResponse.data = await this.bookingRepository.save(newobj);
        await this.bookingRepository.update(newobj.id,newobj);

        // update trip = isDrafting = false
        getTrip.isDrafting = false;
        getTrip.updatedAt = new Date();
        await this.tripRepository.update(getTrip.id,getTrip);
       }
        else
        throw new InternalServerErrorException();
    } catch (error) { 
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async cancelBooking(cancelBookingDto: CancelBookingDto) {
    this.apiResponse = new ResponseResult();
    try {
      var booking = await this.bookingRepository.findOne(cancelBookingDto.id);
       if(Object.keys(booking).length !== 0)
       {
        booking.cancelReason = cancelBookingDto.cancelReason;
        booking.status = BookingStatus.CANCELED;
        booking.updateAt = new Date(); 
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
    this.apiResponse = new ResponseResult();
    try {
      await this.bookingRepository.update({ id: id }, updateBookingDto);
      this.apiResponse.data = await this.bookingRepository.findOne({ id: id });
    } catch (error) {
      this.apiResponse.status = HttpStatus.NOT_FOUND;;
    }
    return this.apiResponse;
  }

  async getbyUserId(userId: string) {
    this.apiResponse = new ResponseResult();
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

  async getCancelBooking(userId: string,top:number) {
    this.apiResponse = new ResponseResult();
    if(top == 0)
      top = 5;
    try {
      this.apiResponse.data = await this.bookingRepository.find({
        where: { userId: userId,status:BookingStatus.CANCELED },
        order: { ['createAt']: 'DESC' },
        relations: ['trip','trip.locations'],
        take:top
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async getBookingHistory(userId: string,top:number) {
    this.apiResponse = new ResponseResult();
    if(top == 0)
      top = 5;
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
    this.apiResponse = new ResponseResult();
    try {
        const tripIds = await this.tripRepository.createQueryBuilder('trip')
            .innerJoinAndSelect('booking', 'booking','booking.trip_id = trip.id')
            .select('trip.id')
            .groupBy('trip.id')
            .where('booking.user_Id = :user_Id', {user_Id: userId})
            .orderBy({'sum(trip.id)': 'DESC','trip.createdat': 'DESC'})
            .limit(top)
            .getMany()

         // Get booking by tripId
         const query = await this.bookingRepository.find({
              relations: ['trip','trip.locations'],
              where: {
                  'trip': { id: In(tripIds.map(ele => ele.id))},
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
        relations: ['trip','trip.locations'],
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
}
