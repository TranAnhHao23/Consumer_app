import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional, IsString, Length, Matches, Max, MaxLength, Min } from "class-validator";

export class CreatePaymentmethodDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    required: false
  })
  @IsOptional()
  @IsString()
  nickname: string;

  @ApiProperty()
  @IsString()
  paymentTypeId: string;

  @ApiProperty({
    required: false
  })
  @IsNumber()
  order: number;

  @ApiProperty()
  @Matches(/^\d{12,19}$/, {
    message: 'Card number invalid'
  })
  cardNum: string;

  @ApiProperty({
    default: '111'
  })
  @Matches(/^\d{3}$/)
  cardCvv: string;

  @ApiProperty({
    default: 12
  })
  @IsInt()
  @Max(12)
  @Min(1)
  cardExpiryMonth: number;

  @ApiProperty({
    default: 25
  })
  @IsInt()
  cardExpiryYear: number;
}
