import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentDto {
     
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
    maxLength: 1,
    required: true
  }) 
  paymentTypeId: number;
  @ApiProperty({
    required: true
  }) 
  amount: number;

  @ApiProperty({
    maxLength: 1,
    required: true
  }) 
  paymentStatus: number;
 
  @ApiProperty({
    maxLength: 255,
    required: true
  })
  note: string;
  
  @ApiProperty({
    maxLength: 45,
    required: true
  })
  resultId: string;

  @ApiProperty({
    maxLength: 255,
    required: true
  })
  resultContent: string;
}
