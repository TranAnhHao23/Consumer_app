import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {BookingEntity} from "./entities/booking.entity";
import {Repository} from "typeorm";

@Injectable()
export class BookingsService {
  constructor(@InjectRepository(BookingEntity) private readonly bookingRepo: Repository<BookingEntity>) {
  }
  create(createBookingDto: CreateBookingDto) {
    return 'This action adds a new booking';
  }

  findAll() {
    return `This action returns all bookings`;
  }

  async findOne(id: number) {
    return await this.bookingRepo.findOne(id, {relations: ["trip"]});
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
