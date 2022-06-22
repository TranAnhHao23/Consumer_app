import { ApiProperty } from "@nestjs/swagger";
export class CancelBookingDto {
    @ApiProperty({
        required: true
        })
    id: string;
    
    @ApiProperty({
        required: true
        })
    cancelReason: string;

    @ApiProperty({
        maxLength: 45,
        required: true
        })
      userId: string;
}