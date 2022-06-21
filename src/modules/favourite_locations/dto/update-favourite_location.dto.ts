import { PartialType } from '@nestjs/swagger';
import { CreateFavouriteLocationDto } from './create-favourite_location.dto';
import { IsString } from 'class-validator';

export class UpdateFavouriteLocationDto extends PartialType(
  CreateFavouriteLocationDto,
) {
  @IsString()
  id: string;

  createAt: Date;

  updateAt: Date;
}
