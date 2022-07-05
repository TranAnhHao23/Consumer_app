import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class SearchingDriverDto {

    @ApiProperty()
    @IsString()
    tripId: string;

    @ApiProperty()
    @IsString()
    api: string;
}
