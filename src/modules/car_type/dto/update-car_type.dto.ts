import { PartialType } from '@nestjs/swagger';
import { CreateCarTypeDto } from './create-car_type.dto';

export class UpdateCarTypeDto extends PartialType(CreateCarTypeDto) {}
