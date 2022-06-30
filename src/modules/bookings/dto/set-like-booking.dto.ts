import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsUUID} from "class-validator"; 

export class SetLikeBookingDto {
    @ApiProperty({ required: true })
    @IsBoolean()
    isLike: boolean;
}