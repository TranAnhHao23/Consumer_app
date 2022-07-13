import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

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
        description: "Ongoing: 0, Completed: 1, Canceled: -1, All: null",
        required: false
    })
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    status: number

    @ApiProperty({
        default: 1
    })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page: number

    @ApiProperty({
        default: 10
    })
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    pageSize: number
}