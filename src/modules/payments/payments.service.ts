import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }
  
  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  processPayment(id: string, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

 

  findByorderNo(orderNo: string) {
    return `This action returns a #${orderNo} payment`;
  }


  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }



  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
