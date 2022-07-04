import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

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
  @IsUUID()
  bookingId: string;
 
  @ApiProperty({
    required: true,
  }) 
  amount: number;
 
  invoiceStatus: number;
 
  @ApiProperty({
    maxLength: 255,
    required: false
  })
  note: string;
}
