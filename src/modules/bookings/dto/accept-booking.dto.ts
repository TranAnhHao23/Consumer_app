import { ApiProperty } from "@nestjs/swagger";
import {IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import {CarInfoDto} from "./car-info.dto";
import {DriverInfoDto} from "./driver-info.dto";
export class AcceptBookingDto {
    @ApiProperty({
        required: false
        })
    @IsOptional()
    @IsString()
    carId: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    carTypeId: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    carIcon: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    carSize: string

    @ApiProperty()
    @IsObject()
    carInfo: CarInfoDto;

    @ApiProperty()
    @IsObject()
    driverInfo: DriverInfoDto
}
