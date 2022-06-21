import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseResult } from 'src/shared/ResponseResult';
import { Repository } from 'typeorm';
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
    try{
      const newobj = this.bookingRepository.create(createBookingDto);
      this.apiResponse.data = await this.bookingRepository.save(newobj);
      // const trip = await this.tripRepository.findOne(createBookingDto.trip_id);
      // if(Object.keys(trip).length !== 0)
      //   this.apiResponse.data = await this.bookingRepository.save(newobj);
      //  else
      //   throw new InternalServerErrorException();
    }catch (error) {

      this.apiResponse.errorMessage = error;
      this.apiResponse.status = 500;
      }
    return this.apiResponse;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
     try{
      const newobj = await this.bookingRepository.update({ id:id }, updateBookingDto);
      this.apiResponse.data = await this.bookingRepository.findOne({ id: id });
    }catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = 500;
      }
    return this.apiResponse;
  }


  findAll() {
    return `This action returns all bookings`;
  }

  async findOne(id: string) {
    try{
      this.apiResponse.data = await this.bookingRepository.findOne(id);
    }catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    return this.apiResponse;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
