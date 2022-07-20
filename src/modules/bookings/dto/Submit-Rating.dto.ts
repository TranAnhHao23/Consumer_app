import {ApiProperty} from "@nestjs/swagger";
import {IsArray, IsDecimal, IsNumber, IsOptional, IsString, IsUUID, Max, Min} from "class-validator";
import {Type} from "class-transformer";

export class SubmitRatingDto {
    @ApiProperty()
    @IsUUID()
    bookingId: string;

    @ApiProperty({
        minimum: 0,
        maximum: 5
    })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number;

    @ApiProperty()
    @IsArray()
    ratingReasons: Array<string>;

    @ApiProperty({
        required: false,
        default: 0,
    })
    @IsOptional()
    @IsNumber()
    tipAmount: number;

    @ApiProperty({
        required: false,
        default: "",
    })
    @IsOptional()
    @IsString()
    additionalComments: string;
}
