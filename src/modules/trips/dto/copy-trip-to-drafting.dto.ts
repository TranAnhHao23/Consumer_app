import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";


export class CopyTripToDrafting {
    @ApiProperty()
    @IsString()
    deviceId: string

    @ApiProperty()
    @IsUUID()
    tripId: string
}