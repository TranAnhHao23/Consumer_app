import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseResult } from 'src/shared/ResponseResult';
import { Repository } from 'typeorm';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { PaymentTypeEntity } from './entities/payment-type.entity';

@Injectable()
export class PaymentTypeService {
  constructor(
    @InjectRepository(PaymentTypeEntity)
    private readonly paymentTypeRepo: Repository<PaymentTypeEntity>
  ) {}

  async findAll() {
    const apiResponse = new ResponseResult()
    
    try {
      const paymentTypes = await this.paymentTypeRepo.find()
      apiResponse.data = paymentTypes
    } catch (error) {
      apiResponse.status = error.status
      apiResponse.errorMessage = error instanceof HttpException ? error.message : 'INTERNAL_SERVER_ERROR'
    }

    return apiResponse
  }
}
