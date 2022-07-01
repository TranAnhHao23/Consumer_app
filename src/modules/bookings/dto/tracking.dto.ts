import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TrackingDto {
    @ApiProperty()
    @IsNumber()
    trackingStatus: number;

    @ApiProperty()
    @IsString()
    tripId: string;

    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty({
        required: false
    })
    carId: string;

    @ApiProperty({
        required: false
    })
    driverId: string;

    @ApiProperty({
        required: true
    })
    distance: number;

    @ApiProperty({
        required: false
    })
    timeToPickUp: number;

    @ApiProperty({
        required: true
    })
    paymentMethodId: string;




}
