import { ApiProperty, PartialType } from '@nestjs/swagger';  
import { IsUUID } from 'class-validator';

export class UpdateInvoiceDto {
  @ApiProperty({
    maxLength: 45,
    required: true
  })
  @IsUUID()
  paymentMethodId: string;
    
  @ApiProperty({
    maxLength: 255,
    required: false
  })
  note: string;
}
