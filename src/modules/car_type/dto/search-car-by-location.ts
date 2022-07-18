import {IsDecimal, IsNumber, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class SearchCarByLocationDto {
    @ApiProperty({
        required: true,
    })
    @IsNumber()
    dep_lat : number;

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    dep_lng : number;

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    des_lat : number;

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    des_lng : number;

    @ApiProperty({
        required: true,
    })
    @IsNumber()
    distance : number;
}
