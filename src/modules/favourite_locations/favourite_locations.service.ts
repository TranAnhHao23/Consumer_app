import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavouriteLocationDto } from './dto/create-favourite_location.dto';
import { UpdateFavouriteLocationDto } from './dto/update-favourite_location.dto';
import { Favourite_locationEntity } from './entities/favourite_location.entity';
 

@Injectable()
export class FavouriteLocationsService {
  constructor(
    @InjectRepository(Favourite_locationEntity)
    private readonly favouriteRepository: Repository<Favourite_locationEntity>,
  ) {
  }
 
  async create(createFavouriteLocationDto: Partial<CreateFavouriteLocationDto>): Promise<Favourite_locationEntity> {
    const newobj = this.favouriteRepository.create(createFavouriteLocationDto);
    return await this.favouriteRepository.save(newobj);
  }

  async getbyuserid(userId: string) {
    return await this.favouriteRepository.find({ where: {userId: userId},order:{["createAt"]:"DESC"}});
  }


  async findOne(id: string) {
    return await this.favouriteRepository.findOne(id);
  }

  async remove(id: string) {
   
    return await this.favouriteRepository.delete(id);

  }
}
