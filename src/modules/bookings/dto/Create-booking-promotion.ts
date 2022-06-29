import { ApiProperty } from "@nestjs/swagger";
export class CreateBookingPromotion {
    @ApiProperty({
        required: true
    })
    id: string;

    @ApiProperty({
        required: true
    })
    code: string;

    @ApiProperty({
        required: true
    })
    name: string;

    @ApiProperty({
        maxLength: 45,
        required: true
    })
    userId: string;
}