import {ApiProperty} from "@nestjs/swagger";
import {IsDecimal, IsNumber, IsString, IsUUID} from "class-validator";

export class SearchingDriverDto {

    @ApiProperty({
        required: true
    })
    @IsString()
    tripId: string;

    @ApiProperty({
        required: true
    })
    @IsString()
    api: string;

    @ApiProperty({
        required: true
    })
    @IsNumber()
    distance: number;

    @ApiProperty({
        maxLength: 45,
        required: true
    })
    @IsUUID()
    paymentMethodId: string;

}
