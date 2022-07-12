import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";

export enum BookingHistoryStatus {
    ON_GOING = 0,
    COMPLETED = 1,
    CANCELED = -1
}

export class GetBookingHistoryDto {
    @ApiProperty({ required: true })
    @IsString()
    userId: string

    @ApiProperty({
        default: 10
    })
    @Type(() => Number)
    @IsNumber()
    limit: number

    @ApiProperty({
        required: false
    })
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    status: number
}