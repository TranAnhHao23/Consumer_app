import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
export class DriverAppBookingDto {
    @ApiProperty({
        required: true
    })
    cancelReason: string;
    
    @ApiProperty({
        maxLength: 45,
        required: false
    })
    booking_id: string;

    @ApiProperty({
        maxLength: 10,
        required: false
    })
    status: number;

    @ApiProperty({
        maxLength: 255,
        required: false
    })
    waiting_free_note: string

    @ApiProperty({
        required: false
    })
    @IsNumber()
    waiting_free_amount: number;

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