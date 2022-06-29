import { ApiProperty } from "@nestjs/swagger";

export class CreateInvoiceDto {
    OrderNo: string;
  
  @ApiProperty({
    maxLength: 45,
    required: true
  }) 
  userId: string; 
 
  @ApiProperty({
    maxLength: 45,
    required: true
  })
  bookingId: string;

  
  @ApiProperty({
    maxLength: 45,
    required: true
  })
  paymentMethodId: string;
  
  @ApiProperty({
    required: true
  }) 
  amount: number;
 
  invoiceStatus: number;
 
  @ApiProperty({
    maxLength: 255,
    required: false
  })
  note: string;
}
