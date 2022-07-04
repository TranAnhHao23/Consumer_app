import { ApiProperty } from "@nestjs/swagger";
import { IsArray, isDecimal, IsOptional, IsUUID } from "class-validator";
import { CreateBookingPromotion } from "./Create-booking-promotion";

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
    @IsUUID()
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

    @ApiProperty({
        maxLength: 45,
        required: true
    })
    @IsUUID()
    paymentMethodId: string;

    @ApiProperty({
        maxLength: 45,
        required: true
    })
    driverAppBookingId: string;

    // @ApiProperty({
    //     default: [
    //         {
    //             "id": "string",
    //             "code": "string",
    //             "name": "string",
    //             "userId": "string" 
    //         } 
    //     ],
    //     required: false
    // })
    // @IsArray()
    // @IsOptional()
    // promotions: [CreateBookingPromotion]
}
