import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePaymentmethodDto } from './create-paymentmethod.dto';

export class UpdatePaymentmethodDto extends PartialType(CreatePaymentmethodDto) {
    @ApiProperty({
        maxLength: 45,
        required: true
    })
    id: string;
    
}
