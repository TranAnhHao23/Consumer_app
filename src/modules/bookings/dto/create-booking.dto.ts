import {ApiProperty} from "@nestjs/swagger";
import {IsArray, isDecimal, IsOptional} from "class-validator"; 

export class CreateBookingDto {
    @ApiProperty({
        maxLength: 45,
        required: true
    })
    carId: string;

    @ApiProperty({
        maxLength: 45,
        required: true
    })
    userId: string;

    @ApiProperty({
        maxLength: 45,
        required: true
    })
    tripId: string;

    @ApiProperty({
        maxLength: 45,
        required: true
    })
    driverId: string;

    @ApiProperty({
        required: true
    })
    distance: number;
 
}
 