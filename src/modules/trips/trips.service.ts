import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { GetDraftingTripDto } from './dto/get-drafting-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { UpsertDraftingTripDto } from './dto/upsert-drafting-trip.dto';
import { TripEntity } from './entities/trip.entity';

@Injectable()
export class TripsService {

  constructor(
    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>
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

  async getDraftingTrip(getDraftingTripDto: GetDraftingTripDto) {
    const draftingTrip = await this.tripRepo.findOne({
      deviceId: getDraftingTripDto.deviceId,
      isDrafting: true
    })
    console.log(draftingTrip)
    return draftingTrip
  }

  async upsertDraftingTrip(upsertDraftingTripDto: UpsertDraftingTripDto) {
    let savedDraftingTrip
    let draftingTrip = await this.getDraftingTrip({
      deviceId: upsertDraftingTripDto.deviceId
    })

    if (!draftingTrip) {
      const newDraftingTrip = this.tripRepo.create({
        ...upsertDraftingTripDto,
        isDrafting: true
      })
      savedDraftingTrip = await newDraftingTrip.save()
    } else {
      draftingTrip.carType = upsertDraftingTripDto.carType
      savedDraftingTrip = await draftingTrip.save()
    }
    return savedDraftingTrip
  }

  async getTripHistory(id: number) {
    // @ts-ignore
    return this.tripRepo.find({
      where: {
        deviceId: id,
        isDrafting: false,
      },
      order: {["createdAt"]: "DESC"},
      relations: ["locations"]
    })
  }
}
