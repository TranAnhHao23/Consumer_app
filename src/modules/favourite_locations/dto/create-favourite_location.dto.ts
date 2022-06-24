import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator';

export class CreateFavouriteLocationDto{
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsString()
  note: string;

  @ApiProperty()
  googleId: string

  @ApiProperty()
  referenceId: string
}
