import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseResult } from 'src/shared/ResponseResult';
import { Repository } from 'typeorm';
import { CreatePaymentmethodDto } from './dto/create-paymentmethod.dto';
import { UpdatePaymentmethodDto } from './dto/update-paymentmethod.dto';
import { PaymentMethod } from './entities/paymentmethod.entity';
 
@Injectable()
export class PaymentmethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private readonly paymentmethodRepository: Repository<PaymentMethod>,
    private apiResponse: ResponseResult,
  ) {}

  async create(createPaymentmethodDto: CreatePaymentmethodDto) {
    this.apiResponse = new ResponseResult();
    try {
      const newPaymentmethod = this.paymentmethodRepository.create(createPaymentmethodDto);
      this.apiResponse.data = await this.paymentmethodRepository.save(newPaymentmethod);
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async update(id: string, updatePaymentmethodDto: UpdatePaymentmethodDto) {
    this.apiResponse = new ResponseResult();
    try {
      await this.paymentmethodRepository.update({ id: id },updatePaymentmethodDto);
      this.apiResponse.data = await this.paymentmethodRepository.findOne(id);
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }
 
  async findOne(id: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.paymentmethodRepository.findOne(id);
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }
 
  async findAll() {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.paymentmethodRepository.find({
        order: { ['order']: 'DESC' },
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }
}
