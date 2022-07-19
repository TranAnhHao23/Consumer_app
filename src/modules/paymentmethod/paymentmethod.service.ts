import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentTypeEntity } from 'src/payment-type/entities/payment-type.entity';
import { ResponseResult } from 'src/shared/ResponseResult';
import { Repository } from 'typeorm';
import { CreatePaymentmethodDto } from './dto/create-paymentmethod.dto';
import { SetDefaultPaymentMethodDto } from './dto/set-default-paymentmethod.dto';
import { UpdatePaymentmethodDto } from './dto/update-paymentmethod.dto';
import { PaymentMethod } from './entities/paymentmethod.entity';

@Injectable()
export class PaymentmethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentmethodRepository: Repository<PaymentMethod>,

    @InjectRepository(PaymentTypeEntity)
    private readonly paymentTypeRepo: Repository<PaymentTypeEntity>,

    private apiResponse: ResponseResult,
  ) { }

  async create(createPaymentmethodDto: CreatePaymentmethodDto) {
    const apiResponse = new ResponseResult(HttpStatus.CREATED);
    try {
      const paymentType = await this.paymentTypeRepo.findOne(createPaymentmethodDto.paymentTypeId)
      if (!paymentType) {
        throw new HttpException('Payment type not found', HttpStatus.NOT_FOUND)
      }
      const newPaymentmethod = this.paymentmethodRepository.create({
        ...createPaymentmethodDto,
        cardLastDigits: createPaymentmethodDto.cardNum.slice(-4),
        paymentType 
      });
      apiResponse.data = await this.paymentmethodRepository.save(newPaymentmethod);
    } catch (error) {
      apiResponse.status = error.status;
      apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return apiResponse;
  }

  async update(id: string, updatePaymentmethodDto: UpdatePaymentmethodDto) {
    const apiResponse = new ResponseResult(HttpStatus.CREATED);
    try {
      const paymentMethod = await this.paymentmethodRepository.findOne({ id, isDeleted: false }, { relations: ['paymentType'] })
      if (!paymentMethod) {
        throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND)
      }

      const paymentType = await this.paymentTypeRepo.findOne(updatePaymentmethodDto.paymentTypeId)
      if (!paymentType) {
        throw new HttpException('Payment type not found', HttpStatus.NOT_FOUND)
      }
      
      paymentMethod.name = updatePaymentmethodDto.name
      paymentMethod.userId = updatePaymentmethodDto.userId
      paymentMethod.nickname = updatePaymentmethodDto.nickname
      paymentMethod.order = updatePaymentmethodDto.order
      paymentMethod.paymentType = paymentType

      const updatedPaymentMethod = await paymentMethod.save()

      apiResponse.data = updatedPaymentMethod
    } catch (error) {
      apiResponse.status = error.status;
      apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return apiResponse;
  }

  async setDefaultPayment(setDefaultPaymentmethodDto: SetDefaultPaymentMethodDto) {
    const apiResponse = new ResponseResult();
    try {
      const paymentMethod = await this.paymentmethodRepository.findOne(
        { id: setDefaultPaymentmethodDto.paymentTypeId, isDeleted: false }, 
        { relations: ['paymentType'] }
      );
      if (!paymentMethod) {
        throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND)
      }
      await this.paymentmethodRepository.createQueryBuilder()
        .update(PaymentMethod)
        .set({
          isDefault: false
        })
        .where(`user_id = '${setDefaultPaymentmethodDto.userId}'`)
        .execute()

      paymentMethod.isDefault = true
      const newDefaultPaymentMethod = await paymentMethod.save()
      apiResponse.data = newDefaultPaymentMethod
    } catch (error) {
      apiResponse.status = error.status;
      apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return apiResponse;
  }

  // async findOne(id: string) {
  //   this.apiResponse = new ResponseResult();
  //   try {
  //     this.apiResponse.data = await this.paymentmethodRepository.findOne(id, { relations: ['paymentType'] });
  //   } catch (error) {
  //     this.apiResponse.status = error.status;
  //     this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
  //   }
  //   return this.apiResponse;
  // }

  async findAllByUser(userId: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.paymentmethodRepository.find({
        where: { userId: userId, isDeleted: false },
        order: { ['isDefault']: 'DESC', ['order']: 'ASC' },
        relations: ['paymentType']
      });
    } catch (error) {
      this.apiResponse.status = error.status;
      this.apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return this.apiResponse;
  }

  async getDefaultPayment(userId: string) {
    const apiResponse = new ResponseResult();
    try {
      const defaultPaymentMethod = await this.paymentmethodRepository.findOne({
        where: { userId, isDefault: true, isDeleted: false },
        relations: ['paymentType']
      });
      if (!defaultPaymentMethod) {
        throw new HttpException('No default payment method', HttpStatus.NOT_FOUND)
      }
      apiResponse.data = defaultPaymentMethod
    } catch (error) {
      apiResponse.status = error.status;
      apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return apiResponse;
  }

  async remove(id: string) {
    const apiResponse = new ResponseResult();
    try {
      const paymentMethod = await this.paymentmethodRepository.findOne(id, {
        relations: ['paymentType']
      });
      if (!paymentMethod) {
        throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND)
      }

      paymentMethod.isDeleted = true
      const removedPaymentMethod = await paymentMethod.save()
      
      apiResponse.data = removedPaymentMethod
    } catch (error) {
      apiResponse.status = error.status;
      apiResponse.errorMessage = error instanceof HttpException ? error.message : "INTERNAL_SERVER_ERROR";
    }
    return apiResponse;
  }
}
