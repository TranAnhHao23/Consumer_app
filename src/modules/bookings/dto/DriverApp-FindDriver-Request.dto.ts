import {ApiProperty} from "@nestjs/swagger";
import {IsDecimal, IsNumber, IsOptional, IsString} from "class-validator";

export class DriverAppFindDriverRequestDto {
    depLong: number;

    depLat: number;

    desLong1: number;

    desLat1: number;

    desLong2?: number;

    desLat2?: number;

    desLong3?: number

    desLat3?: number;

    distance: number;

    carTypeId: string;



}
