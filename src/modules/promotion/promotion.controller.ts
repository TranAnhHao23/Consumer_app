import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('promotion')
@Controller('v1/rhc/promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}
  @Post()
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionService.create(createPromotionDto);
  }
  
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdatePromotionDto) {
    return this.promotionService.update(id, updateInvoiceDto);
  }

  @Post("getavailablepromotion/:userId")
  findAvailablePromotion(@Param('userId') userId: string) {
    return this.promotionService.findAvailablePromotion(userId);
  }
  
  @Post('findavailablebykeyword/:userId/:keyword')
  getBookingHistory(
    @Param('userId') userId: string,
    @Param('keyword') keyword: string
  ) {
    return this.promotionService.findAvailableByUserIdAndKeyword(userId,keyword);
  }

  @Get('getallbyuser/:userId')
  findByorderNo(@Param('userId') userId: string) {
    return this.promotionService.findAllByUserId(userId);
  }

  @Get('getallbybooking/:bookingId')
  findByUserId(@Param('bookingId') bookingId: string) {
    return this.promotionService.findAllByBookingId(bookingId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.promotionService.findOne(id);
  }
}
