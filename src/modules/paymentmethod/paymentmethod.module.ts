import { Module } from '@nestjs/common';
import { PaymentmethodService } from './paymentmethod.service';
import { PaymentmethodController } from './paymentmethod.controller';
import { ResponseResult } from 'src/shared/ResponseResult';
import { PaymentMethod } from './entities/paymentmethod.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  controllers: [PaymentmethodController],
  providers: [PaymentmethodService,ResponseResult]
})
export class PaymentmethodModule {}
 