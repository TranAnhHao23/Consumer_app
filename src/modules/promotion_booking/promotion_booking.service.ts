import { Injectable } from '@nestjs/common';
import { CreatePromotionBookingDto } from './dto/create-promotion_booking.dto';
import { UpdatePromotionBookingDto } from './dto/update-promotion_booking.dto';

@Injectable()
export class PromotionBookingService {
  create(createPromotionBookingDto: CreatePromotionBookingDto) {
    return 'This action adds a new promotionBooking';
  }

  findAll() {
    return `This action returns all promotionBooking`;
  }

  findOne(id: number) {
    return `This action returns a #${id} promotionBooking`;
  }

  update(id: number, updatePromotionBookingDto: UpdatePromotionBookingDto) {
    return `This action updates a #${id} promotionBooking`;
  }

  remove(id: number) {
    return `This action removes a #${id} promotionBooking`;
  }
}
