import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  UseFilters, Res
} from '@nestjs/common';
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
import {HttpExceptionFilter} from "../../shared/http-exception.filter";
import {Response} from "express";
import {GetRatingReasonsDto} from "./dto/Get-Rating-Reasons.dto";
import {SubmitRatingDto} from "./dto/Submit-Rating.dto";

@ApiTags('booking')
@Controller('v1/rhc/bookings')
@UseFilters(new HttpExceptionFilter())
export class BookingsController {
   constructor(private readonly bookingsService: BookingsService) {}

  @Post()
    async create(@Body() createBookingDto: CreateBookingDto, @Res() res: Response) {
      const result = await this.bookingsService.create(createBookingDto);
      return res.status(result.status).json(result);
    }


  @Post('update')
  async update(@Body() updateBookingDto: UpdateBookingDto, @Res() res: Response) {
     const result = await this.bookingsService.update(
         updateBookingDto.id, updateBookingDto,
     );
    return res.status(result.status).json(result);
  }

  @Patch('notefordriver/:id')
  async oteForDriver(@Param('id') id: string, @Body() noteForDriverDto: NoteForDriverDto, @Res() res: Response) {
     const result = await this.bookingsService.noteForDriver(id, noteForDriverDto);
     return res.status(result.status).json(result);
  }

  @Get('getbyuserid/:userId')
  async getbyUserId(@Param('userId') userId: string, @Res() res: Response) {
       const result = await this.bookingsService.getbyUserId(userId);
       return res.status(result.status).json(result);
  }

  @Patch('setlike/:id')
  async setLike(@Param('id') id: string, @Body() setLikeBookingDto: SetLikeBookingDto, @Res() res: Response) {
      const result = await this.bookingsService.setLike(id, setLikeBookingDto);
      return res.status(result.status).json(result);
  }

  // @Post('getfavourite/:userId/:top')
  // getFavouriteBooking(
  //   @Param('userId') userId: string,
  //   @Param('top') top: number
  // ) {
  //   return this.bookingsService.getFavouriteBooking(userId,+top);
  // }

  @Get('getcancelbooking/:userId/:top')
  async getCancelBooking(
    @Param('userId') userId: string,
    @Param('top') top: number,
    @Res() res: Response
  ) {
      const result = await this.bookingsService.getCancelBooking(userId,+top);
      return res.status(result.status).json(result);
  }

  @Post('cancelbooking')
  async cancelBooking( @Body() cancelBookingDto: CancelBookingDto, @Res() res: Response) {
      const result = await this.bookingsService.cancelBooking2(cancelBookingDto);
      return res.status(result.status).json(result);
  }

  @Get('getbookinghistory/:userId/:top')
  async getBookingHistory(
    @Param('userId') userId: string,
    @Param('top') top: number,
    @Res() res: Response
  ) {
      const result = await this.bookingsService.getBookingHistory(userId,+top);
      return res.status(result.status).json(result);
  }

  @Get('getrecentfavoritebookings')
  async getRecentFavoriteBooking(@Query() getRecentFavoriteBookingDto: GetRecentFavoriteBookingDto, @Res() res: Response) {
      const result = await this.bookingsService.getRecentFavoriteBooking(getRecentFavoriteBookingDto);
      return res.status(result.status).json(result);
  }

  @Get('cancelreasonlist')
  async getCancelReasonList(@Res() res: Response) {
      const result = await this.bookingsService.getCancelReasonList();
      return res.status(result.status).json(result);
  }

  @Get('emergencyinfo')
  async getEmergencyInformation(@Res() res: Response) {
      const result = await this.bookingsService.getEmergencyInformation();
      return res.status(result.status).json(result);
  }

  // @Post('trackingstatus')
  // getTrackingStatus(){
  //    return this.bookingsService.getTrackingStatus();
  // }


  @Post('searchingdriver')
  async searchingDriver(@Body() searchingDriverDto: SearchingDriverDto, @Res() res: Response) {
      const result = await this.bookingsService.findDriver(searchingDriverDto);
      return res.status(result.status).json(result);
  }

    @Get('getratingreasons')
    async getRatingReasons(@Query() getRatingReasonsDto: GetRatingReasonsDto, @Res() res: Response) {
        const result = await this.bookingsService.getRatingReasons(getRatingReasonsDto);
        return res.status(result.status).json(result);
    }

    @Post('submitratingreasons')
    async submitRatingReasons(@Body() submitRatingDto: SubmitRatingDto, @Res() res: Response) {
        const result = await this.bookingsService.submitRating(submitRatingDto);
        return res.status(result.status).json(result);
    }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
      const result = await this.bookingsService.findOne(id);
      return res.status(result.status).json(result);
  }

  @Patch('acceptbooking/:id')
  async acceptBooking(@Param('id') id: string, @Body() acceptBookingDto: AcceptBookingDto, @Res() res: Response) {
      const result = await this.bookingsService.acceptBooking(id, acceptBookingDto);
      return res.status(result.status).json(result);
  }

  //API update booking status (Driver app)
  @Post("driverapp/confirmpickuppassenger")
  async confirmPickupPassenger( @Body() driverAppConfirmPickupPassengerDto: DriverAppConfirmPickupPassengerDto, @Res() res: Response) {
      const result = await this.bookingsService.confirmPickupPassenger(driverAppConfirmPickupPassengerDto);
      return res.status(result.status).json(result);
  }

   //API update booking status (Driver app)
   @Post("driverapp/finishtrip")
   async finishTrip( @Body() driverAppFinishTripDto: DriverAppFinishTripDto, @Res() res: Response) {
       const result = await this.bookingsService.finishtrip(driverAppFinishTripDto);
       return res.status(result.status).json(result);
   }

    //API update booking status (Driver app)
    @Post("driverapp/canceltrip")
    async canceltrip( @Body() driverAppCancelTripDto: DriverAppCancelTripDto, @Res() res: Response) {
        const result = await this.bookingsService.cancelTrip(driverAppCancelTripDto);
        return res.status(result.status).json(result);
    }


}
