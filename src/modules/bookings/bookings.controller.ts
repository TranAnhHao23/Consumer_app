import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {ApiTags} from "@nestjs/swagger";
import { CancelBookingDto } from './dto/CancelBookingDto';
import { NoteForDriverDto } from './dto/note-for-driver.dto';
import { SetLikeBookingDto } from './dto/set-like-booking.dto';
import { GetRecentFavoriteBookingDto } from './dto/get-recent-favorite-booking.dto';
import { AcceptBookingDto } from './dto/accept-booking.dto';
import { SearchingDriverDto } from "./dto/searching-driver.dto";
import { DriverAppConfirmPickupPassengerDto } from './dto/DriverApp-Confirm-Pickup-Passenger.dto';
import { DriverAppCancelTripDto } from './dto/DriverApp-Cancel-Trip.dto';
import { DriverAppFinishTripDto } from './dto/DriverApp-Finish-Trip.dto';

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

  @Patch('notefordriver/:id')
  noteForDriver(@Param('id') id: string, @Body() noteForDriverDto: NoteForDriverDto) {
    return this.bookingsService.noteForDriver(id, noteForDriverDto)
  }

  @Get('getbyuserid/:userId')
  getbyUserId(@Param('userId') userId: string) {
    return this.bookingsService.getbyUserId(userId);
  }

  @Patch('setlike/:id')
  setLike(@Param('id') id: string, @Body() setLikeBookingDto: SetLikeBookingDto) {
    return this.bookingsService.setLike(id, setLikeBookingDto)
  }

  // @Post('getfavourite/:userId/:top')
  // getFavouriteBooking(
  //   @Param('userId') userId: string,
  //   @Param('top') top: number
  // ) { 
  //   return this.bookingsService.getFavouriteBooking(userId,+top);
  // }

  @Get('getcancelbooking/:userId/:top')
  getCancelBooking(
    @Param('userId') userId: string,
    @Param('top') top: number
  ) {
    return this.bookingsService.getCancelBooking(userId,+top);
  }

  @Post('cancelbooking')
  cancelBooking( @Body() cancelBookingDto: CancelBookingDto  ) {
    return this.bookingsService.cancelBooking2(cancelBookingDto);
  }

  @Get('getbookinghistory/:userId/:top')
  getBookingHistory(
    @Param('userId') userId: string,
    @Param('top') top: number
  ) {
    return this.bookingsService.getBookingHistory(userId,+top);
  }

  @Get('getrecentfavoritebookings')
  getRecentFavoriteBooking(@Query() getRecentFavoriteBookingDto: GetRecentFavoriteBookingDto) {
    return this.bookingsService.getRecentFavoriteBooking(getRecentFavoriteBookingDto)
  }

  @Get('cancelreasonlist')
  getCancelReasonList() {
    return this.bookingsService.getCancelReasonList();
  }

  @Get('emergencyinfo')
  getEmergencyInformation() {
    return this.bookingsService.getEmergencyInformation();
  }

  // @Post('trackingstatus')
  // getTrackingStatus(){
  //    return this.bookingsService.getTrackingStatus();
  // }


  @Post('searchingdriver')
  searchingDriver(@Body() searchingDriverDto: SearchingDriverDto) {
     return this.bookingsService.findDriver(searchingDriverDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch('acceptbooking/:id')
  acceptBooking(@Param('id') id: string, @Body() acceptBookingDto: AcceptBookingDto) {
    return this.bookingsService.acceptBooking(id, acceptBookingDto)
  }
  
  //API update booking status (Driver app)
  @Post("driverapp/confirmpickuppassenger")
  confirmPickupPassenger( @Body() driverAppConfirmPickupPassengerDto: DriverAppConfirmPickupPassengerDto  ) {
    return this.bookingsService.confirmPickupPassenger(driverAppConfirmPickupPassengerDto);
  }

   //API update booking status (Driver app)
   @Post("driverapp/finishtrip")
   finishTrip( @Body() driverAppFinishTripDto: DriverAppFinishTripDto  ) {
     return this.bookingsService.finishtrip(driverAppFinishTripDto);
   }

    //API update booking status (Driver app)
  @Post("driverapp/canceltrip")
  canceltrip( @Body() driverAppCancelTripDto: DriverAppCancelTripDto  ) {
    return this.bookingsService.cancelTrip(driverAppCancelTripDto);
  }
}
