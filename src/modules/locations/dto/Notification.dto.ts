import {ApiProperty} from "@nestjs/swagger";
import {IsString, IsUUID} from "class-validator";

export class NotificationDto {
    @ApiProperty({
        required: true
    })
    @IsString()
    title: string;

    @ApiProperty({
        required: true
    })
    @IsString()
    message: string;

    @ApiProperty({
        required: true
    })
    @IsUUID()
    userId: string;
}
