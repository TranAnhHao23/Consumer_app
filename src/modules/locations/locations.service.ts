import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripEntity } from '../trips/entities/trip.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationEntity } from './entities/location.entity';

@Injectable()
export class LocationsService {

  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepo: Repository<LocationEntity>,

    @InjectRepository(TripEntity)
    private readonly tripRepo: Repository<TripEntity>
  ) {}

  async create(createLocationDto: CreateLocationDto) {
    const trip = await this.tripRepo.findOne(createLocationDto.tripId)
    const newLocation = this.locationRepo.create({...createLocationDto, trip})
    const savedLocation = await newLocation.save()
    return savedLocation
  }

  // async findAll() {
  //   return await this.locationRepo.find({ relations: ['trip'] })
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} location`;
  // }

  // update(id: number, updateLocationDto: UpdateLocationDto) {
  //   return `This action updates a #${id} location`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} location`;
  // }
}
