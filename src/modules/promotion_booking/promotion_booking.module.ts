import { Module } from '@nestjs/common';
import { PromotionBookingService } from './promotion_booking.service';
import { PromotionBookingController } from './promotion_booking.controller';

@Module({
  controllers: [PromotionBookingController],
  providers: [PromotionBookingService]
})
export class PromotionBookingModule {}
