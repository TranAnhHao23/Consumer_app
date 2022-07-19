import { Module } from '@nestjs/common';
import { PaymentmethodService } from './paymentmethod.service';
import { PaymentmethodController } from './paymentmethod.controller';
import { ResponseResult } from 'src/shared/ResponseResult';
import { PaymentMethod } from './entities/paymentmethod.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTypeEntity } from 'src/payment-type/entities/payment-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod, PaymentTypeEntity])],
  controllers: [PaymentmethodController],
  providers: [PaymentmethodService,ResponseResult]
})
export class PaymentmethodModule {}
 