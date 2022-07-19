import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, Matches, Max, Min } from 'class-validator';
import { CreatePaymentmethodDto } from './create-paymentmethod.dto';

export class UpdatePaymentmethodDto {
    @ApiProperty()
    @IsString()
    userId: string;

    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    nickname: string;

    @ApiProperty()
    @IsString()
    paymentTypeId: string;

    @ApiProperty({
        required: false
    })
    @IsNumber()
    order: number;
}
