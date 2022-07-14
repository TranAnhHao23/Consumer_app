import {BadRequestException, HttpException, HttpStatus, Injectable, Res} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDraftingTripDto } from './dto/get-drafting-trip.dto';
import { UpsertDraftingTripDto } from './dto/upsert-drafting-trip.dto';
import { TripEntity } from './entities/trip.entity';
import { ResponseResult } from '../../shared/ResponseResult';
import { LocationEntity } from '../locations/entities/location.entity';
import { LocationsService } from '../locations/locations.service';
import { CreateLocationDto } from '../locations/dto/create-location.dto';
import { CopyTripToDrafting } from './dto/copy-trip-to-drafting.dto';
import { stringify } from 'querystring';
import { CreateTripLocationDto } from './dto/create-trip-location.dto';
import {TripAgainDto} from "./dto/trip-again.dto";
import { CarTypeEntity } from '../car_type/entities/car_type.entity';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>,

    @InjectRepository(LocationEntity)
    private readonly locationRepo: Repository<LocationEntity>,

    @InjectRepository(CarTypeEntity)
    private readonly carTypeRepo: Repository<CarTypeEntity>,

    private readonly locationService: LocationsService,

    private apiResponse: ResponseResult,
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
    const apiResponse = new ResponseResult()
    try {
      const draftingTrip = await this.tripRepo.findOne({
        deviceId: getDraftingTripDto.deviceId,
        isDrafting: true
      }, { relations: ['locations'] })

      if (!draftingTrip) {
        throw new HttpException('There is not any drafting trip', HttpStatus.NOT_FOUND)
      }

      apiResponse.data = draftingTrip
    } catch(error) {
      apiResponse.status = error.status;
      apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return apiResponse
  }

  isValidStartTime(startTime: Date) {
    const nowInMsec = (new Date()).getTime()
    const startTimeInMsec = (new Date(startTime)).getTime()
    const difftime = startTimeInMsec - nowInMsec
    return difftime >= 1 * 3600 * 1000
  }

  private async upsertLocationsForTrip(trip: TripEntity, locations: [CreateTripLocationDto]) {
    if (locations.length >= 4) {
      throw new HttpException('Exceed number of destinations', HttpStatus.BAD_REQUEST)
    }
    if (locations.length < 2) {
      throw new HttpException('Missing destinations', HttpStatus.BAD_REQUEST)
    }
    await Promise.all([
      this.locationRepo.delete({ trip: trip }),
      this.tripRepo.update(trip.id, { copyTripId: null })
    ])

    await Promise.all(locations.map(async (location: CreateLocationDto, index) => {
      location.tripId = trip.id;
      location.milestone = index
      await this.locationService.create(location)
    }));
  }

  async upsertDraftingTrip(upsertDraftingTripDto: UpsertDraftingTripDto) {
    const apiResponse = new ResponseResult(HttpStatus.CREATED)
    try {
      if ((!upsertDraftingTripDto.isTripLater && upsertDraftingTripDto.startTime) || (upsertDraftingTripDto.isTripLater && upsertDraftingTripDto.startTime == null)){
        throw new HttpException('Start time in this trip type is not acceptable', HttpStatus.NOT_ACCEPTABLE);
      } else {
        if (upsertDraftingTripDto.isTripLater && !this.isValidStartTime(upsertDraftingTripDto.startTime )) {
          throw new HttpException('Value of startTime is invalid', HttpStatus.BAD_REQUEST)
        }
      }

      const carType = await this.carTypeRepo.findOne(upsertDraftingTripDto.carType)
      if (!carType) {
        throw new HttpException('Car type not found', HttpStatus.NOT_FOUND)
      }

      let savedDraftingTrip;
      const draftingTrip = (await this.getDraftingTripByDeviceId({
        deviceId: upsertDraftingTripDto.deviceId,
      })).data;

      if (!draftingTrip) {
        const newDraftingTrip = this.tripRepo.create({
          deviceId: upsertDraftingTripDto.deviceId,
          carType: upsertDraftingTripDto.carType,
          isTripLater: upsertDraftingTripDto.isTripLater,
          startTime: upsertDraftingTripDto.startTime,
          isSilent: upsertDraftingTripDto.isSilent,
          noteForDriver: upsertDraftingTripDto.noteForDriver,
          isDrafting: true
        });
        savedDraftingTrip = await newDraftingTrip.save();
      } else {
        if ('carType' in upsertDraftingTripDto) {
          draftingTrip.carType = upsertDraftingTripDto.carType
        }
        if ('isTripLater' in upsertDraftingTripDto) {
          draftingTrip.isTripLater = upsertDraftingTripDto.isTripLater
        }
        if ('startTime' in upsertDraftingTripDto) {
          draftingTrip.startTime = upsertDraftingTripDto.startTime
        }
        if ('isSilent' in upsertDraftingTripDto) {
          draftingTrip.isSilent = upsertDraftingTripDto.isSilent
        }
        if ('noteForDriver' in upsertDraftingTripDto) {
          draftingTrip.noteForDriver = upsertDraftingTripDto.noteForDriver
        }
        savedDraftingTrip = await draftingTrip.save();
      }

      if (upsertDraftingTripDto.locations) {
        await this.upsertLocationsForTrip(savedDraftingTrip, upsertDraftingTripDto.locations)
      }

      apiResponse.data = await this.tripRepo.findOne(savedDraftingTrip.id, { relations: ['locations'] })
    } catch (error) {
      apiResponse.status = error.status;
      apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }

    return apiResponse
  }

  // async copyTripToDrafting(copyTriptoDraftDto: CopyTripToDrafting) {
  //   this.apiResponse = new ResponseResult()
  //   try {
  //     const trip = await this.tripRepo.findOne(copyTriptoDraftDto.tripId)

  //     const locations = await this.locationRepo.find({ trip: trip })

  //     this.tripRepo.delete({ deviceId: copyTriptoDraftDto.deviceId, isDrafting: true })

  //     const copyTrip = this.tripRepo.create({
  //       deviceId: copyTriptoDraftDto.deviceId,
  //       carType: trip.carType,
  //       isDrafting: true,
  //       startTime: null,
  //       copyTripId: trip.copyTripId || trip.id
  //     })

  //     const savedDraftingTrip = await copyTrip.save()


  //     const copyLocations = locations.map(location => {
  //       return {
  //         longitude: location.longitude,
  //         latitude: location.latitude,
  //         address: location.address,
  //         note: location.note,
  //         googleId: location.googleId,
  //         referenceId: location.referenceId,
  //         addressName: location.addressName, // Anh thêm 1 dòng này nhé Cảnh
  //         trip: savedDraftingTrip
  //       }
  //     })

  //     await Promise.all(copyLocations.map(async(copyLocation, index) => {
  //       await this.locationService.create({
  //         ...copyLocation,
  //         tripId: savedDraftingTrip.id,
  //         milestone: index
  //       })
  //     }))

  //     this.apiResponse.status = HttpStatus.CREATED
  //     this.apiResponse.data = await this.tripRepo.findOne(savedDraftingTrip.id, { relations: ['locations'] })
  //   } catch (error) {
  //     this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
  //   }

  //   return this.apiResponse
  // }

  // async getTripHistory(deviceId: string) {
  //   this.apiResponse = new ResponseResult();
  //   try {
  //     this.apiResponse.data = await this.tripRepo.find({
  //       where: {
  //         deviceId: deviceId,
  //         isDrafting: false,
  //       },
  //       order: { ['createdAt']: 'DESC' },
  //       relations: ['locations'],
  //     });
  //   } catch (error) {
  //     this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
  //   }
  //   return this.apiResponse;
  // }

  // async getTripAgain(tripAgainDto: TripAgainDto) {
  //   this.apiResponse = new ResponseResult();
  //   try {
  //       let trip = await this.tripRepo.findOne(tripAgainDto.tripId);
  //       let locations = await this.locationRepo.find({
  //         where: {trip: trip}
  //       })
  //       await this.tripRepo.delete({
  //         deviceId: trip.deviceId,
  //         isDrafting: true
  //       })
  //       let tripSave = await this.tripRepo.create({
  //           deviceId: trip.deviceId,
  //           carType: trip.carType,
  //           isDrafting: true,
  //           copyTripId: trip.id
  //       })
  //       await this.tripRepo.save(tripSave);
  //       let locationsSave = locations.map((data, index) => {
  //           return {
  //             address: data.address,
  //             note: data.note,
  //             milestone: index,
  //             trip: tripSave,
  //             longitude: data.longitude,
  //             latitude: data.latitude,
  //             googleId: data.googleId,
  //             referenceId: data.referenceId,
  //             addressName: data.addressName
  //           }
  //       })
  //       let locationSaveToRepo = this.locationRepo.create(locationsSave);
  //       await this.locationRepo.save(locationSaveToRepo);
  //       this.apiResponse.data = await this.tripRepo.findOne(tripSave.id, {
  //         relations: ['locations']
  //       });
  //   } catch (error) {
  //       this.apiResponse.status = HttpStatus.NOT_FOUND;
  //   }
  //   return this.apiResponse;
  // }
}
