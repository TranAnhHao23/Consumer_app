import { Injectable } from '@nestjs/common';
import { CreateFavouriteLocationDto } from './dto/create-favourite_location.dto';
import { UpdateFavouriteLocationDto } from './dto/update-favourite_location.dto';

@Injectable()
export class FavouriteLocationsService {
  create(createFavouriteLocationDto: CreateFavouriteLocationDto) {
    return 'This action adds a new favouriteLocation';
  }

  findAll() {
    return `This action returns all favouriteLocations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} favouriteLocation`;
  }

  update(id: number, updateFavouriteLocationDto: UpdateFavouriteLocationDto) {
    return `This action updates a #${id} favouriteLocation`;
  }

  remove(id: number) {
    return `This action removes a #${id} favouriteLocation`;
  }
}
