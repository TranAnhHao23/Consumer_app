import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentmethodDto {
    @ApiProperty({
        maxLength: 50,
        required: true
      })
    name: string;
    
    @ApiProperty({
        maxLength: 255,
        required: false
      })
    icon: string;
  
    @ApiProperty({
        maxLength: 255,
        required: false
      })
    note: string;

    @ApiProperty({
        required: false
      })
    order: number;
    
    @ApiProperty({
        required: false
      })
    status: number; 
}
