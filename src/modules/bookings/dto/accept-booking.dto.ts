import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";
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

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    carLicensePlateNumber: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    carBranch: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    carColor: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    carRegion: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    driverId: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    driverName: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    driverAvatar: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    driverPhoneNum: string

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    driverRating: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    driverLatitude: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    driverLongitude: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    driverStatus: number
}