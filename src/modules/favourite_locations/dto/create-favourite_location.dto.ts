import { IsString } from 'class-validator';

export class CreateFavouriteLocationDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  longitude: string;

  @IsString()
  latitude: string;

  @IsString()
  address: string;

  @IsString()
  note: string;
}
