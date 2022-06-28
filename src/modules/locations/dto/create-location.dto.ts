
import { ApiProperty } from '@nestjs/swagger'
import {IsUUID, IsNotEmpty, IsDecimal, IsString, Length, IsNumber, IsInt, Min, Max, IsOptional} from 'class-validator'

export class CreateLocationDto {
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
    @IsUUID()
    tripId: string

    @ApiProperty()
    googleId: string

    @ApiProperty()
    referenceId: string

    @ApiProperty({
        description: "0 – source, 1 – first destination, 2 – second destination, 3 – third destination",
        minimum: 0,
        maximum: 3
    })
    @IsInt()
    @Min(0)
    @Max(3)
    milestone: number

    @ApiProperty()
    addressName: string;
}
