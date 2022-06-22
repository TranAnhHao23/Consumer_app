import {HttpCode, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {ResponseResult} from 'src/shared/ResponseResult';
import {Repository} from 'typeorm';
import {CreateFavouriteLocationDto} from './dto/create-favourite_location.dto';
import {UpdateFavouriteLocationDto} from './dto/update-favourite_location.dto';
import {Favourite_locationEntity} from './entities/favourite_location.entity';

@Injectable()
export class FavouriteLocationsService {
    constructor(
        @InjectRepository(Favourite_locationEntity)
        private readonly favouriteRepository: Repository<Favourite_locationEntity>,
        private readonly apiResponse: ResponseResult,
    ) {
    }

    async create(createFavouriteLocationDto: CreateFavouriteLocationDto) {
        try {
            const newFavouriteLocation = this.favouriteRepository.create(
                createFavouriteLocationDto,
            );
            this.apiResponse.data = await this.favouriteRepository.save(
                newFavouriteLocation,
            );
        } catch (error) {
            this.apiResponse.errorMessage = error;
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async update(updateFavouriteLocationDto: UpdateFavouriteLocationDto,) {
        try {
            const updateFavouriteLocation = await this.favouriteRepository.update(
                {id: updateFavouriteLocationDto.id},
                updateFavouriteLocationDto,
            );
            this.apiResponse.data = await this.favouriteRepository.findOne({
                id: updateFavouriteLocationDto.id,
            });
        } catch (error) {
            this.apiResponse.errorMessage = error;
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async getFavouriteLocationByUserId(userId: string) {
        try {
            this.apiResponse.data = await this.favouriteRepository.find({
                where: {userId: userId},
                order: {['createAt']: 'DESC'},
            });
        } catch (error) {
            this.apiResponse.errorMessage = error;
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async findOne(id: string) {
        try {
            this.apiResponse.data = await this.favouriteRepository.findOne(id);
        } catch (error) {
            this.apiResponse.errorMessage = error;
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }

    async remove(id: string) {
        try {
            this.apiResponse.data = await this.favouriteRepository.delete(id);
        } catch (error) {
            this.apiResponse.errorMessage = error;
            this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return this.apiResponse;
    }
}
