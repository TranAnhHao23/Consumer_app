import { PartialType } from '@nestjs/swagger';
import { CreatePromotionBookingDto } from './create-promotion_booking.dto';

export class UpdatePromotionBookingDto extends PartialType(CreatePromotionBookingDto) {}
