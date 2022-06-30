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
  ) { }

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
      await this.paymentmethodRepository.update({ id: id }, updatePaymentmethodDto);
      this.apiResponse.data = await this.paymentmethodRepository.findOne(id);
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async setDefaultPayment(userId: string, id: string) {
    this.apiResponse = new ResponseResult();
    try {
      const payment = await this.paymentmethodRepository.findOne(id);
      if (Object.keys(payment).length !== 0) {

        // update all = false
        const allPayments = await this.paymentmethodRepository.find({
          where: { userId: userId }
        });
        for (const element of allPayments) {
          element.isDefault = false;
          await this.paymentmethodRepository.update(element.id, element);
        }

        // set current = true
        payment.isDefault = true;
        payment.updateAt = new Date();
        await this.paymentmethodRepository.update(id, payment);
        this.apiResponse.data = await this.paymentmethodRepository.findOne(id);
      } else {
        this.apiResponse.status = HttpStatus.NOT_FOUND;
        return this.apiResponse;
      }
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

  async findAllByUser(userId: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.paymentmethodRepository.find({
        where: { userId: userId },
        order: { ['isDefault']: 'DESC', ['order']: 'ASC' },
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }

  async getDefaultPayment(userId: string) {
    this.apiResponse = new ResponseResult();
    try {
      this.apiResponse.data = await this.paymentmethodRepository.findOne({
        where: { userId: userId }
      });
    } catch (error) {
      this.apiResponse.status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    return this.apiResponse;
  }
}
