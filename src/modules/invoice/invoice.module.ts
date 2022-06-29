import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseResult } from 'src/shared/ResponseResult';
import { BookingEntity } from '../bookings/entities/booking.entity';
import { PaymentMethod } from '../paymentmethod/entities/paymentmethod.entity';
import { Invoice } from './entities/invoice.entity';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice,BookingEntity,PaymentMethod])],
  controllers: [InvoiceController],
  providers: [InvoiceService, ResponseResult]
})

export class InvoiceModule {}
