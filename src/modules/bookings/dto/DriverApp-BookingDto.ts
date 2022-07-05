import { ApiProperty } from "@nestjs/swagger";
export class DriverAppBookingDto {
    @ApiProperty({
        required: true
    })
    cancelReason: string;

    @ApiProperty({
        maxLength: 45,
        required: false
    })
    driverAppBookingId: string;


}