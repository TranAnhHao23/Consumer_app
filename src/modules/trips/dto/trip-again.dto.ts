import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class TripAgainDto {
    // @ApiProperty()
    // @IsString()
    // deviceId: string;

    // @ApiProperty()
    // @IsString()
    // carType: string;

    @ApiProperty()
    @IsString()
    tripId: string;


}