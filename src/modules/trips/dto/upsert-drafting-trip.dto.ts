import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsString } from "class-validator"

export class UpsertDraftingTripDto {
    @ApiProperty()
    @IsString()
    deviceId: string

    @ApiProperty()
    @IsNumber()
    carType: number
}
