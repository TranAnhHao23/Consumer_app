import { Controller, Get, Post, Body, Param, UseFilters, Res } from '@nestjs/common';
import { PaymentmethodService } from './paymentmethod.service';
import { CreatePaymentmethodDto } from './dto/create-paymentmethod.dto';
import { UpdatePaymentmethodDto } from './dto/update-paymentmethod.dto';
import { ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/shared/http-exception.filter';
import { Response } from 'express';

@ApiTags('payment method')
@Controller('v1/rhc/paymentmethod')
@UseFilters(new HttpExceptionFilter())
export class PaymentmethodController {
  constructor(private readonly paymentmethodService: PaymentmethodService) { }

  @Post()
  async create(@Body() createPaymentmethodDto: CreatePaymentmethodDto, @Res() res: Response) {
    const result = await this.paymentmethodService.create(createPaymentmethodDto);
    return res.status(result.status).json(result)
  }

  @Post('update/:id')
  async update(@Param('id') id: string, @Body() updatePaymentmethodDto: UpdatePaymentmethodDto, @Res() res: Response) {
    const result = await this.paymentmethodService.update(id, updatePaymentmethodDto);
    return res.status(result.status).json(result)
  }

  @Get('setdefaultpayment/:userId/:id')
  async setdefaultpayment(
    @Param('userId') userId: string,
    @Param('id') id: string, @Res() res: Response) {
    const result = await this.paymentmethodService.setDefaultPayment(userId, id);
    return res.status(result.status).json(result)
  }

  @Get('getallbyuser/:userId')
  async findAllByUser(
    @Param('userId') userId: string, @Res() res: Response) {
    const result = await this.paymentmethodService.findAllByUser(userId);
    return res.status(result.status).json(result)
  }

  @Get('getdefaultpayment/:userId')
  async getDefaultPayment(
    @Param('userId') userId: string, @Res() res: Response) {
    const result = await this.paymentmethodService.getDefaultPayment(userId);
    return res.status(result.status).json(result)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.paymentmethodService.findOne(id);
    return res.status(result.status).json(result)
  }
}
