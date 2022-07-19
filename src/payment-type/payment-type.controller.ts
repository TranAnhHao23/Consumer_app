import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, Res } from '@nestjs/common';
import { PaymentTypeService } from './payment-type.service';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';
import { HttpErrorFilter } from 'src/core/http-error.filter';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@UseFilters(new HttpErrorFilter())
@ApiTags('payment-type')
@Controller('v1/rhc/payment-type')
export class PaymentTypeController {
  constructor(private readonly paymentTypeService: PaymentTypeService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const result = await this.paymentTypeService.findAll();
    return res.status(result.status).json(result)
  }
}