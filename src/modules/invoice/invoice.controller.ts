import { Controller, Get, Post, Body, Param } from '@nestjs/common';  
import { ApiTags } from '@nestjs/swagger';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceService } from './invoice.service';

@ApiTags('invoice')
@Controller('v1/rhc/invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }
  
  @Post('update/:id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoiceService.update(id, updateInvoiceDto);
  }

  @Post("processpayment/:id")
  processPayment(@Param('id') id: string) {
    return this.invoiceService.processPayment(id);
  }

  @Get('getbyorderno/:orderNo')
  findByorderNo(@Param('orderNo') orderNo: string) {
    return this.invoiceService.findByorderNo(orderNo);
  }

  @Get('getbyuserid/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.invoiceService.findByUserId(userId);
  }

  @Get('getcurrentpayment/:userId')
  findCurrentPayment(@Param('userId') userId: string) {
    return this.invoiceService.findCurrentPayment(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }
 
}
