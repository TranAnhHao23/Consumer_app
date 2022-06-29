import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreatePromotionDto {
    @ApiProperty({
        required: true
    })
    @IsString()
    name: string;

    @ApiProperty({
        required: true
    })
    userId: string;

    @ApiProperty({
        required: true
    })
    amount: number;

    @ApiProperty({
        required: true,
        description: '1: Cash. 2: Coin',
    })
    promoType: number;

    @ApiProperty({
        required: true
    })
    currency: string;

    @ApiProperty({
        required: true,
        description: '0: Available. 1: IsUsed',
    })
    status: number;

    @IsOptional()
    note: string;

    @ApiProperty({
        required: true,
    })
    expiredDate: Date;
}
