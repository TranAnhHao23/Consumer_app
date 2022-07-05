import {ApiProperty} from "@nestjs/swagger";
import {ToNumericTrans} from "../../../shared/column-numeric-transformer";
import {IsDecimal} from "class-validator";

export class DriverAppFindDriverRequestDto {
    @ApiProperty({
        required: true,
    })
    @IsDecimal()
    depLong: number;

    @ApiProperty({
        required: true
    })
    @IsDecimal()
    depLat: number;

    @ApiProperty({
        required: false
    })
    @IsDecimal()
    desLong1: number;

    @ApiProperty({
        required: false
    })
    @IsDecimal()
    desLat1: number;

    @ApiProperty({
        required: false
    })
    @IsDecimal()
    desLong2: number;

    @ApiProperty({
        required: false
    })
    @IsDecimal()
    desLat2: number;

    @ApiProperty({
        required: true
    })
    @IsDecimal()
    desLong3: number

    @ApiProperty({
        required: true
    })
    @IsDecimal()
    desLat3: number;

    @ApiProperty({
        required: false
    })
    @IsDecimal()
    distance: number;

    @ApiProperty({
        required: true
    })
    carTypeId: string;



}
