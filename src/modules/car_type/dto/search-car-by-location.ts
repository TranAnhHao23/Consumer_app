import {IsDecimal, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SearchCarByLocationDto {
    @ApiProperty()
    @IsDecimal()
    longitude: number;

    @ApiProperty()
    @IsDecimal()
    latitude: number;

    @ApiProperty()
    @IsDecimal()
    searchRadius: number;
}