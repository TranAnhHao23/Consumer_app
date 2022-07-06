import {ApiProperty} from "@nestjs/swagger";
import {IsDecimal, IsNumber, IsOptional, IsString} from "class-validator";

export class DriverAppFindDriverRequestDto {
    @ApiProperty({
        required: true,
    })
    @IsNumber()
    depLong: number;

    @ApiProperty({
        required: true
    })
    @IsDecimal()
    depLat: number;

    // @ApiProperty()
    // @IsDecimal()
    // @IsOptional()
    // desLong1: number;
    //
    // @ApiProperty()
    // @IsDecimal()
    // @IsOptional()
    // desLat1: number;
    //
    // @ApiProperty()
    // @IsDecimal()
    // @IsOptional()
    // desLong2: number;
    //
    // @ApiProperty()
    // @IsDecimal()
    // @IsOptional()
    // desLat2: number;

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
    @IsDecimal()
    carTypeId: string;



}
