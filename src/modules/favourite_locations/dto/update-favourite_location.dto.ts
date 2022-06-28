
import { CreateFavouriteLocationDto } from './create-favourite_location.dto';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFavouriteLocationDto extends CreateFavouriteLocationDto {
  @ApiProperty()
  @IsString()
  id: string;

  // createdAt: Date;
  //
  // @ApiProperty()
  // updatedAt: Date;
}
