import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) 
{
    @ApiProperty({
        maxLength: 45,
        required: true
    })
  id: string;
}
