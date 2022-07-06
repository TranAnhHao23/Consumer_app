import { Controller, Get, Post, Body, Param, Delete, UseFilters, Res } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/shared/http-exception.filter';
import { Response } from 'express';

@ApiTags('promotion')
@Controller('v1/rhc/promotion')
@UseFilters(new HttpExceptionFilter())
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) { }
  @Post()
  async create(@Body() createPromotionDto: CreatePromotionDto, @Res() res: Response) {
    const result = await this.promotionService.create(createPromotionDto);
    return res.status(result.status).json(result)
  }

  @Post('update/:id')
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdatePromotionDto, @Res() res: Response) {
    const result = await this.promotionService.update(id, updateInvoiceDto);
    return res.status(result.status).json(result)
  }

  @Get("getavailablepromotion/:userId")
  async findAvailablePromotion(@Param('userId') userId: string, @Res() res: Response) {
    const result = await this.promotionService.findAvailablePromotion(userId);
    return res.status(result.status).json(result)
  }

  @Get('findavailablebykeyword/:userId/:keyword')
  async getBookingHistory(
    @Param('userId') userId: string,
    @Param('keyword') keyword: string
    , @Res() res: Response) {
    const result = await this.promotionService.findAvailableByUserIdAndKeyword(userId, keyword);
    return res.status(result.status).json(result)
  }

  @Get('getallbyuser/:userId')
  async findByorderNo(@Param('userId') userId: string, @Res() res: Response) {
    const result = await this.promotionService.findAllByUserId(userId);
    return res.status(result.status).json(result)
  }

  @Get('getallbybooking/:bookingId')
  async findByUserId(@Param('bookingId') bookingId: string, @Res() res: Response) {
    const result = await this.promotionService.findAllByBookingId(bookingId);
    return res.status(result.status).json(result)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.promotionService.findOne(id);
    return res.status(result.status).json(result)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const result = await this.promotionService.remove(id);
    return res.status(result.status).json(result)
  }
}
