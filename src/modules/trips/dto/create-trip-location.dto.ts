
import { ApiProperty } from '@nestjs/swagger'
import {IsNotEmpty, IsString, Length, IsNumber, IsOptional} from 'class-validator'

export class CreateTripLocationDto {
    @ApiProperty()
    @IsNumber()
    longitude: number

    @ApiProperty()
    @IsNumber()
    latitude: number

    @ApiProperty({
        maxLength: 255
    })
    @IsNotEmpty()
    @IsString()
    @Length(0, 255)
    address: string

    @ApiProperty({
        maxLength: 255,
        required: false
    })
    @IsString()
    @IsOptional()
    @Length(0, 255)
    note: string

    @ApiProperty()
    googleId: string

    @ApiProperty()
    referenceId: string

    @ApiProperty()
    addressName: string;
}
