import {ApiProperty} from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {IsBoolean, IsNumber, IsNumberString, IsString, IsUUID} from "class-validator"; 

export class GetRecentFavoriteBookingDto {
    @ApiProperty({ required: true })
    @IsString()
    userId: string

    @ApiProperty({
        default: 10
    })
    @IsNumberString()
    limit: number
}