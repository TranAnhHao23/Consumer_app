import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {ApiTags} from "@nestjs/swagger";
import { CancelBookingDto } from './dto/CancelBookingDto';

@ApiTags('booking')
@Controller('v1/rhc/bookings')
export class BookingsController {
   constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }


  @Post('update')
  update(@Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingsService.update(
      updateBookingDto.id,  updateBookingDto,
    );
  }

  @Get('getbyuserid/:userId')
  getbyUserId(@Param('userId') userId: string) {
    return this.bookingsService.getbyUserId(userId);
  }

  @Post('getfavourite/:userId/:top')
  getFavouriteBooking(
    @Param('userId') userId: string,
    @Param('top') top: number
  ) { 
    return this.bookingsService.getFavouriteBooking(userId,+top);
  }

  @Post('getcancelbooking/:userId/:top')
  getCancelBooking(
    @Param('userId') userId: string,
    @Param('top') top: number
  ) {
    return this.bookingsService.getCancelBooking(userId,+top);
  }

  @Post('cancelbooking')
  cancelBooking( @Body() cancelBookingDto: CancelBookingDto  ) {
    return this.bookingsService.cancelBooking(cancelBookingDto);
  }

  @Post('getbookinghistory/:userId/:top')
  getBookingHistory(
    @Param('userId') userId: string,
    @Param('top') top: number
  ) {
    return this.bookingsService.getBookingHistory(userId,+top);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Get('cancelreason/list')
  getCancelReasonList() {
     return this.bookingsService.getCancelReasonList();
  }
}
