import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';  
import { ResponseResult } from 'src/shared/ResponseResult';
import { Repository } from 'typeorm';
import { CreateFavouriteLocationDto } from './dto/create-favourite_location.dto';
import { UpdateFavouriteLocationDto } from './dto/update-favourite_location.dto';
import { Favourite_locationEntity } from './entities/favourite_location.entity'; 

@Injectable()
export class FavouriteLocationsService {
  constructor(
    @InjectRepository(Favourite_locationEntity)
    private readonly favouriteRepository: Repository<Favourite_locationEntity>,

    
    private readonly apiResponse: ResponseResult,
    ) {}
   
    
  async create(createFavouriteLocationDto: Partial<CreateFavouriteLocationDto>): Promise<Favourite_locationEntity> {
    const newobj = this.favouriteRepository.create(createFavouriteLocationDto);
    return await this.favouriteRepository.save(newobj);
  }

  async update(id: string,updateFavouriteLocationDto: Partial<UpdateFavouriteLocationDto>)  {
    try{
      const newobj = await this.favouriteRepository.update({ id:id }, updateFavouriteLocationDto);
      this.apiResponse.data = await this.favouriteRepository.findOne({ id: id }); 
    }catch (error) {

      this.apiResponse.errorMessage = error;
      this.apiResponse.status = 500;
      }
    return this.apiResponse;
  }

  async getbyuserid(userId: string) {
    try{
      this.apiResponse.data =await this.favouriteRepository.find({ where: {userId: userId},order:{["createAt"]:"DESC"}});
    }catch (error) {
      this.apiResponse.errorMessage = error;
      this.apiResponse.status = 500;
      }
    return this.apiResponse;
  }


  async findOne(id: string) {
    return await this.favouriteRepository.findOne(id);
  }

  async remove(id: string) {
   
    return await this.favouriteRepository.delete(id);

  }
}
