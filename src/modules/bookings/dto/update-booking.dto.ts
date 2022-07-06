import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto {
    @ApiProperty({
        maxLength: 45,
        required: true
    })
    id: string; 

    @ApiProperty({
        required: true
    })
    distance: number;

    @ApiProperty({
        maxLength: 45,
        required: true
    })
    @IsUUID()
    paymentMethodId: string;
}
