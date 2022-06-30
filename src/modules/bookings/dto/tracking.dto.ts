import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TrackingDto {
    @ApiProperty()
    @IsNumber()
    trackingStatus: number;

    @ApiProperty()
    @IsString()
    tripId: string;


}
