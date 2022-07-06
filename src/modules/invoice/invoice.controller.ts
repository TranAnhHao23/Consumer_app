import { Controller, Get, Post, Body, Param, UseFilters, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/shared/http-exception.filter';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceService } from './invoice.service';

@ApiTags('invoice')
@Controller('v1/rhc/invoice')
@UseFilters(new HttpExceptionFilter())
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) { }

  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto, @Res() res: Response) {
    const result = await this.invoiceService.create(createInvoiceDto);
    return res.status(result.status).json(result)
  }

  @Post('update/:id')
  async update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto, @Res() res: Response) {
    const result = await this.invoiceService.update(id, updateInvoiceDto);
    return res.status(result.status).json(result)
  }

  @Get("processinvoice/:id")
  async processPayment(@Param('id') id: string, @Res() res: Response) {
    const result = await this.invoiceService.processPayment(id);
    return res.status(result.status).json(result)
  }

  @Get('getbyorderno/:orderNo')
  async findByorderNo(@Param('orderNo') orderNo: string, @Res() res: Response) {
    const result = await this.invoiceService.findByorderNo(orderNo);
    return res.status(result.status).json(result)
  }

  @Get('getbyuserid/:userId')
  async findByUserId(@Param('userId') userId: string, @Res() res: Response) {
    const result = await this.invoiceService.findByUserId(userId);
    return res.status(result.status).json(result)
  }

  @Get('getcurrentpayment/:userId')
  async findCurrentPayment(@Param('userId') userId: string, @Res() res: Response) {
    const result = await this.invoiceService.findCurrentPayment(userId);
    return res.status(result.status).json(result)
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const result = await this.invoiceService.findOne(id);
    return res.status(result.status).json(result)
  }
}
