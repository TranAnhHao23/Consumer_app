import { ApiProperty } from "@nestjs/swagger";

export class CreatePaymentmethodDto {
  @ApiProperty({
    maxLength: 50,
    required: true
  })
  userId: string;

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
    required: true,
    description: '0: Inactive. 1: Active',
  })
  status: number;
}
