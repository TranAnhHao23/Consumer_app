import {IsDecimal, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SearchCarByLocationDto {
    @ApiProperty()
    @IsNumber()
    longitude: number;

    @ApiProperty()
    @IsNumber()
    latitude: number;

    @ApiProperty()
    @IsNumber()
    searchRadius: number;
}