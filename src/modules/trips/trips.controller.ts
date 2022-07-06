import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, Res, UseFilters } from '@nestjs/common';
import { TripsService } from './trips.service';
import { GetDraftingTripDto } from './dto/get-drafting-trip.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpsertDraftingTripDto } from './dto/upsert-drafting-trip.dto';
import { ResponseResult } from 'src/shared/ResponseResult';
import { CopyTripToDrafting } from './dto/copy-trip-to-drafting.dto';
import {TripAgainDto} from "./dto/trip-again.dto";
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/shared/http-exception.filter';

@ApiTags('trip')
@Controller('v1/rhc/trips')
@UseFilters(new HttpExceptionFilter())
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
  async getDraftingTripByDeviceId(@Query() getDraftingTripDto: GetDraftingTripDto, @Res() res: Response ) {
    const result = await this.tripsService.getDraftingTripByDeviceId(getDraftingTripDto)
    return res.status(result.status).json(result)
  }
  
  @Post('upsertdraftingtrip')
  async upsertDraftingTrip(@Body() upsertDraftingTripDto: UpsertDraftingTripDto, @Res() res: Response) {
    const result = await this.tripsService.upsertDraftingTrip(upsertDraftingTripDto)
    return res.status(result.status).json(result)
  }

  // @Post('copytriptodrafting')
  // async copyTripToDrafting(@Query() copyTriptoDraftDto: CopyTripToDrafting) {
  //   return this.tripsService.copyTripToDrafting(copyTriptoDraftDto)
  // }

  // @Get('history/:deviceId')
  // getTripHistory(@Param('deviceId') deviceId: string){
  //   return this.tripsService.getTripHistory(deviceId);
  // }

  // @Post('tripagain')
  // getTripAgain(@Body() tripAgainDto: TripAgainDto) {
  //   return this.tripsService.getTripAgain(tripAgainDto);
  // }

}
