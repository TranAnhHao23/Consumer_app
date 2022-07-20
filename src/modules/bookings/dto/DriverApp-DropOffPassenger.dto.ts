import {ApiProperty} from "@nestjs/swagger";
import {IsNumber, IsString, Max, Min} from "class-validator";

export class DriverAppDropOffPassengerDto {
    @ApiProperty({
        maxLength: 45,
        required: true
    })
    @IsString()
    booking_id: string;

    @ApiProperty({
        required: true,
        description: 'Milestone midway stop is 1,2 or 3',
        minimum: 1,
        maximum: 3,
        default: 1
    })
    @Max(3)
    @Min(1)
    @IsNumber()
    milestone: number;

    @ApiProperty({
        required: true,
        default: new Date()
    })
    arrivedTime: Date;

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
