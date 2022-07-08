import { ApiProperty } from "@nestjs/swagger";
import {IsNumber, IsObject, IsOptional, IsString} from "class-validator";
import {CarInfoDto} from "./car-info.dto";
import {DriverInfoDto} from "./driver-info.dto";
export class AcceptBookingDto {

    // @ApiProperty()
    // @IsString()
    // driverBookingId: string;

    @ApiProperty()
    @IsObject()
    carInfo: CarInfoDto;

    @ApiProperty()
    @IsObject()
    driverInfo: DriverInfoDto
}
