import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentmethodService } from './paymentmethod.service';
import { CreatePaymentmethodDto } from './dto/create-paymentmethod.dto';
import { UpdatePaymentmethodDto } from './dto/update-paymentmethod.dto';
import { ApiTags } from '@nestjs/swagger';
 
@ApiTags('payment method')
@Controller('v1/rhc/paymentmethod')
export class PaymentmethodController {
  constructor(private readonly paymentmethodService: PaymentmethodService) {}

  @Post()
  create(@Body() createPaymentmethodDto: CreatePaymentmethodDto) {
    return this.paymentmethodService.create(createPaymentmethodDto);
  }

  @Post('update/:id')
  update(@Param('id') id: string, @Body() updatePaymentmethodDto: UpdatePaymentmethodDto) {
    return this.paymentmethodService.update(id, updatePaymentmethodDto);
  }

  @Get('getall')
  findAll() {
    return this.paymentmethodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentmethodService.findOne(id);
  }
}
