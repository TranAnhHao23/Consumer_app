import {ApiProperty} from "@nestjs/swagger";
import {IsObject, IsString} from "class-validator";
import {DriverEntity} from "../../driver/entities/driver.entity";
import {CarEntity} from "../../car/entities/car.entity";

export class DriverAppFindDriverResponseDto {
    @ApiProperty({
        required: true
    })
    @IsString()
    bookingId: string;

    @ApiProperty({
        required: true
    })
    status: number

    @ApiProperty({
        required: true
    })
    @IsObject()
    driverInfoId: DriverEntity;

    @ApiProperty({
        required: true
    })
    @IsObject()
    carInfoId: CarEntity;

}
