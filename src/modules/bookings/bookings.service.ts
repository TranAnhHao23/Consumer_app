import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseResult } from 'src/shared/ResponseResult';
import { createQueryBuilder, Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingEntity } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(BookingEntity)
    private readonly bookingRepository: Repository<BookingEntity>,
    private readonly apiResponse: ResponseResult,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    try {
      const newobj = this.bookingRepository.create(createBookingDto);
      this.apiResponse.data = await this.bookingRepository.save(newobj);
      // const trip = await this.tripRepository.findOne(createBookingDto.trip_id);
      // if(Object.keys(trip).length !== 0)
      //   this.apiResponse.data = await this.bookingRepository.save(newobj);
      //  else
      //   throw new InternalServerErrorException();
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = 500;
    }
    return this.apiResponse;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    try {
      await this.bookingRepository.update({ id: id }, updateBookingDto);
      this.apiResponse.data = await this.bookingRepository.findOne({ id: id });
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = 500;
    }
    return this.apiResponse;
  }

  async findAll() {
    try {
      this.apiResponse.data = await this.bookingRepository.find({
        relations: ['trip'],
      });
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async findOne(id: string) {
    try {
      this.apiResponse.data = await this.bookingRepository.findOne(id, {
        relations: ['trip'],
      });
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async remove(id: string) {
    try {
      await this.bookingRepository.delete(id);
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = HttpStatus.NOT_FOUND;
    }
    return this.apiResponse;
  }

  async getBookingHistory(deviceId: string) {
    try {
      const query = await this.bookingRepository
        .createQueryBuilder('booking')
        .innerJoinAndSelect('booking.trip', 'trip')
        .where('device_id = :id', { id: deviceId })
        .orderBy('createdAt', 'DESC')
        .getMany();
      console.log(query);
      this.apiResponse.data = query;
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = HttpStatus.NOT_FOUND;
    }
    return this.apiResponse;
  }
}
