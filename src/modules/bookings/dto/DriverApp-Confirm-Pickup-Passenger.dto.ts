import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
export class DriverAppConfirmPickupPassengerDto {
    @ApiProperty({
        maxLength: 45,
        required: true
    })
    booking_id: string;

    @ApiProperty({
        required: false
    })
    @IsNumber()
    longitude: number;

    @ApiProperty({
        required: false
    })
    @IsNumber()
    latitude: number;

    @ApiProperty({
        required: true
    })
    arrivedTime: Date;

}
