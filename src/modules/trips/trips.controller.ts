import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { TripsService } from './trips.service';
import { GetDraftingTripDto } from './dto/get-drafting-trip.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpsertDraftingTripDto } from './dto/upsert-drafting-trip.dto';
import { ResponseResult } from 'src/shared/ResponseResult';
import { CopyTripToDrafting } from './dto/copy-trip-to-drafting.dto';
import {TripAgainDto} from "./dto/trip-again.dto";

@ApiTags('trip')
@Controller('v1/rhc/trips')
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
    
    private readonly apiResponse: ResponseResult
  ) {}


  // @Post()
  // create(@Body() createTripDto: CreateTripDto) {
  //   return this.tripsService.create(createTripDto);
  // }

  // @Get()
  // findAll() {
  //   return this.tripsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tripsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
  //   return this.tripsService.update(+id, updateTripDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tripsService.remove(+id);

  @Get('getdraftingtripbydeviceid')
  async getDraftingTripByDeviceId(@Query() getDraftingTripDto: GetDraftingTripDto ) {
    return this.tripsService.getDraftingTripByDeviceId(getDraftingTripDto)
  }
  
  @Post('upsertdraftingtrip')
  async upsertDraftingTrip(@Body() upsertDraftingTripDto: UpsertDraftingTripDto) {
    return this.tripsService.upsertDraftingTrip(upsertDraftingTripDto)
  }

  @Post('copytriptodrafting')
  async copyTripToDrafting(@Query() copyTriptoDraftDto: CopyTripToDrafting) {
    return this.tripsService.copyTripToDrafting(copyTriptoDraftDto)
  }

  // @Get('history/:deviceId')
  // getTripHistory(@Param('deviceId') deviceId: string){
  //   return this.tripsService.getTripHistory(deviceId);
  // }

  // @Post('tripagain')
  // getTripAgain(@Body() tripAgainDto: TripAgainDto) {
  //   return this.tripsService.getTripAgain(tripAgainDto);
  // }

}
