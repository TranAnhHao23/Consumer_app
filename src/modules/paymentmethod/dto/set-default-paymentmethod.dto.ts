import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SetDefaultPaymentMethodDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  paymentTypeId: string;
}
