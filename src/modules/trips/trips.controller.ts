import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException, HttpException, HttpStatus } from '@nestjs/common';
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { GetDraftingTripDto } from './dto/get-drafting-trip.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpsertDraftingTripDto } from './dto/upsert-drafting-trip.dto';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}


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

  @Get('drafting')
  async getDraftingTrip(@Query() getDraftingTripDto: GetDraftingTripDto ) {
    const draftingTrip = await this.tripsService.getDraftingTrip(getDraftingTripDto)
    if (!draftingTrip) {
      throw new HttpException('There is not any drafting trip', HttpStatus.NOT_FOUND)
    }
    return {
      data: draftingTrip
    }
  }
  
  @Post('drafting')
  async upsertDraftingTrip(@Body() upsertDraftingTripDto: UpsertDraftingTripDto) {
    const savedDraftingTrip = await this.tripsService.upsertDraftingTrip(upsertDraftingTripDto)
    return {
      data: savedDraftingTrip
    }
  }

  @Get('history/:id')
  getTripHistory(@Param('id') id: string){
    return this.tripsService.getTripHistory(+id);
  }

}
