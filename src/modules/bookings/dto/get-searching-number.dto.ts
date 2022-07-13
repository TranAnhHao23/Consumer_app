import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class GetSearchingNumberDto {
    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    depLong: number

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    depLat: number

    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    distance: number
}