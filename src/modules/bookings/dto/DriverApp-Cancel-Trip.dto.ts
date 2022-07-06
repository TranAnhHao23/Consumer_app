import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
export class DriverAppCancelTripDto {
    @ApiProperty({
        required: true
    })
    cancelReason: string;
    
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
}