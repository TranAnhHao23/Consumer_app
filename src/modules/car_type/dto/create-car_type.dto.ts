import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCarTypeDto {
  @IsString()
  typeName: string;

  @IsString()
  typeSlogan: string;

  @IsString()
  carImage: string;

  @IsString()
  carIcon: string;

  @IsString()
  firstDistanceFee;

  @IsNumber()
  secondDistanceFee;

  @IsNumber()
  thirdDistanceFee;

  @IsNumber()
  fourthDistanceFee;

  @IsNumber()
  fifthDistanceFee;

  @IsNumber()
  sixthDistanceFee;

  @IsNumber()
  seventhDistanceFee;

  @IsNumber()
  platformFee;

  @IsNumber()
  waitingFee;

  @IsNumber()
  longitude;

  @IsNumber()
  latitude;

  @IsNumber()
  price;
}
