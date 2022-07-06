import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class DriverInfoDto {
    // @ApiProperty({
    //     required: false
    // })
    // @IsOptional()
    // @IsString()
    // driverId: string

    // @ApiProperty({
    //     required: false
    // })
    // @IsOptional()
    // @IsString()
    // name: string

    // @ApiProperty({
    //     required: false
    // })
    // @IsOptional()
    // @IsString()
    // avatar: string

    // @ApiProperty({
    //     required: false
    // })
    // @IsOptional()
    // @IsString()
    // phoneNumber: string

    // @ApiProperty({
    //     required: false
    // })
    // @IsOptional()
    // @IsNumber()
    // rating: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    longitude: number

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsNumber()
    latitude: number
}