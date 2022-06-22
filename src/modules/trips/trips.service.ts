import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDraftingTripDto } from './dto/get-drafting-trip.dto';
import { UpsertDraftingTripDto } from './dto/upsert-drafting-trip.dto';
import { TripEntity } from './entities/trip.entity';
import { ResponseResult } from '../../shared/ResponseResult';
import { LocationEntity } from '../locations/entities/location.entity';
import { LocationsService } from '../locations/locations.service';
import { CreateLocationDto } from '../locations/dto/create-location.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>,

    @InjectRepository(LocationEntity)
    private readonly locationRepo: Repository<LocationEntity>,

    private readonly locationService: LocationsService,

    private readonly apiResponse: ResponseResult,
  ) {}

  // create(createTripDto: CreateTripDto) {
  //   return 'This action adds a new trip';
  // }
  //
  // findAll() {
  //   return `This action returns all trips`;
  // }
  //
  // findOne(id: number) {
  //   return `This action returns a #${id} trip`;
  // }
  //
  // update(id: number, updateTripDto: UpdateTripDto) {
  //   return `This action updates a #${id} trip`;
  // }
  //

  // remove(id: number) {
  //   return `This action removes a #${id} trip`;
  // }

  async getDraftingTripByDeviceId(getDraftingTripDto: GetDraftingTripDto) {
    const draftingTrip = await this.tripRepo.findOne({
      deviceId: getDraftingTripDto.deviceId,
      isDrafting: true
    }, { relations: ['locations'] })
    return draftingTrip
  }

  async upsertDraftingTrip(upsertDraftingTripDto: UpsertDraftingTripDto) {
    
    let savedDraftingTrip;
    const draftingTrip = await this.getDraftingTripByDeviceId({
      deviceId: upsertDraftingTripDto.deviceId,
    });

    if (!draftingTrip) {
      const newDraftingTrip = this.tripRepo.create({
        deviceId: upsertDraftingTripDto.deviceId,
        carType: upsertDraftingTripDto.carType,
        isDrafting: true
      });
      savedDraftingTrip = await newDraftingTrip.save();
    } else {
      draftingTrip.carType = upsertDraftingTripDto.carType;
      savedDraftingTrip = await draftingTrip.save();
    }
    
    if (upsertDraftingTripDto.locations) {
      await this.locationRepo.delete({ trip: savedDraftingTrip })

      await Promise.all(upsertDraftingTripDto.locations.map(async (location: CreateLocationDto, index) => {
        location.tripId = savedDraftingTrip.id;
        location.milestone = index
        await this.locationService.create(location)
      }));
    }
  }

  async getTripHistory(id: string) {
    try {
      this.apiResponse.data = await this.tripRepo.find({
        where: {
          deviceId: id,
          isDrafting: false,
        },
        order: { ['createdAt']: 'DESC' },
        relations: ['locations'],
      });
    } catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }
}
