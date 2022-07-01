
import { ApiProperty } from '@nestjs/swagger'
import {IsUUID, IsNotEmpty, IsDecimal, IsString, Length, IsNumber, IsInt, Min, Max, IsOptional, IsNumberString} from 'class-validator'

export class GetFrequentLocationDto {
    @ApiProperty()
    @IsString()
    userId: string

    @ApiProperty({
        default: 3
    })
    @IsNumberString()
    limit: string
}