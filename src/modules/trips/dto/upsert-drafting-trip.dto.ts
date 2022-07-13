import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsDate, IsDateString, IsNumber, IsOptional, IsString } from "class-validator"
import { CreateTripLocationDto } from "./create-trip-location.dto"

export class UpsertDraftingTripDto {
    @ApiProperty()
    @IsString()
    deviceId: string

    @ApiProperty({
        required: false
    })
    @IsNumber()
    @IsOptional()
    carType: number

    @ApiProperty({
        default: [
            {
                "longitude": 0,
                "latitude": 0,
                "address": "string",
                "note": "string",
                "googleId": "string",
                "referenceId": "string",
                "addressName": "string"
            },
            {
                "longitude": 1,
                "latitude": 1,
                "address": "string",
                "note": "string",
                "googleId": "string",
                "referenceId": "string",
                "addressName": "string"
            }
        ],
        required: false
    })
    @IsArray()
    @IsOptional()
    locations: [CreateTripLocationDto]

    @ApiProperty({
        description: 'Use for booking later. If book now, then startTime = null.',
        default: null,
        required: false
    })
    @IsOptional()
    @IsDateString()
    startTime: Date

    @ApiProperty({
        required: true,
        default: false
    })
    isSilent: boolean;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    noteForDriver: string;
}
