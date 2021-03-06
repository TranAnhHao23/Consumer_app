import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { startWith } from 'rxjs';
import { ResponseResult } from 'src/shared/ResponseResult';
import { Between, LessThan, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';

enum PromotionStatus {
  AVAILABLE = 0,
  ISUSED = 1
}

@Injectable()
export class PromotionService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promotionRepository: Repository<Promotion>,
    private apiResponse: ResponseResult
  ) { }

  async create(createPromotionDto: CreatePromotionDto) {
    this.apiResponse = new ResponseResult(HttpStatus.CREATED);
    try {
      const promo = this.promotionRepository.create(createPromotionDto);
      this.apiResponse.data = await this.promotionRepository.save(promo);
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto) {
    this.apiResponse = new ResponseResult(HttpStatus.CREATED);
    try {
      const updatePromotion = this.promotionRepository.create(updatePromotionDto);
      const getPromotion = await this.promotionRepository.findOne(id);

      if (updatePromotion.userId === "") {
        throw new HttpException("UserId is required", HttpStatus.NOT_FOUND);
      }

      if (getPromotion != null && Object.keys(getPromotion).length !== 0) {
        await this.promotionRepository.update({ id: id }, updatePromotion);
        this.apiResponse.data = await this.promotionRepository.findOne(id);
      }
      else {
        throw new HttpException("Promotion not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async findAvailablePromotion(userId: string) {
    this.apiResponse = new ResponseResult();
    const currentDate = new Date();
    try {
      this.apiResponse.data = await this.promotionRepository.find({
        where: { userId: userId, status: PromotionStatus.AVAILABLE, expiredDate: MoreThanOrEqual(currentDate) },
        order: { ['expiredDate']: 'ASC' }
      });
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async findAllByUserId(userId: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.promotionRepository.find({
        where: { userId: userId },
        order: { ['expiredDate']: 'ASC' }
      });
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async findAvailableByUserIdAndKeyword(userId: string, keyword: string) {
    this.apiResponse = new ResponseResult();
    const currentDate = new Date();
    try {
      this.apiResponse.data = await this.promotionRepository.find({
        where: { userId: userId, code: Like(`%${keyword}%`), status: PromotionStatus.AVAILABLE, expiredDate: MoreThanOrEqual(currentDate) },
        order: { ['expiredDate']: 'ASC' }
      });
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async findAllByBookingId(bookingId: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.promotionRepository.find({
        where: { booking: bookingId },
        order: { ['expiredDate']: 'ASC' }
      });
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async findOne(id: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.promotionRepository.findOne(id);
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async remove(id: string) {
    this.apiResponse = new ResponseResult();
    try {
      const getPromotion = await this.promotionRepository.findOne(id);
      if (getPromotion != null && Object.keys(getPromotion).length !== 0) {
        await this.promotionRepository.delete(id);
      }
      else {
        throw new HttpException("Promotion not found",HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }
}
