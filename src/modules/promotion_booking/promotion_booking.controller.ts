import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionBookingService } from './promotion_booking.service';
import { CreatePromotionBookingDto } from './dto/create-promotion_booking.dto';
import { UpdatePromotionBookingDto } from './dto/update-promotion_booking.dto';

@Controller('promotion-booking')
export class PromotionBookingController {
  constructor(private readonly promotionBookingService: PromotionBookingService) {}

  @Post()
  create(@Body() createPromotionBookingDto: CreatePromotionBookingDto) {
    return this.promotionBookingService.create(createPromotionBookingDto);
  }

  @Get()
  findAll() {
    return this.promotionBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionBookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePromotionBookingDto: UpdatePromotionBookingDto) {
    return this.promotionBookingService.update(+id, updatePromotionBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.promotionBookingService.remove(+id);
  }
}
