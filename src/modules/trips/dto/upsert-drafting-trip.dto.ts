import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator"
import { CreateTripLocationDto } from "./create-trip-location.dto"

export class UpsertDraftingTripDto {
    @ApiProperty()
    @IsString()
    deviceId: string

    @ApiProperty()
    @IsNumber()
    carType: number

    @ApiProperty({
        default: [
            {
                "longitude": 0,
                "latitude": 0,
                "address": "string",
                "note": "string"
            },
            {
                "longitude": 1,
                "latitude": 1,
                "address": "string",
                "note": "string"
            }
        ]
    })
    @IsArray()
    @IsOptional()
    locations: [CreateTripLocationDto]
}
