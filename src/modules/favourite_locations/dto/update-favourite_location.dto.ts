import { PartialType } from '@nestjs/swagger';
import { CreateFavouriteLocationDto } from './create-favourite_location.dto';

export class UpdateFavouriteLocationDto extends PartialType(CreateFavouriteLocationDto) {
    createAt: Date;
    updateAt: Date;
}
