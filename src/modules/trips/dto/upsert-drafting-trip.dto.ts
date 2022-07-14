import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsBoolean, IsDate, IsDateString, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator"
import { CreateTripLocationDto } from "./create-trip-location.dto"

export class UpsertDraftingTripDto {
    @ApiProperty()
    @IsString()
    deviceId: string

    @ApiProperty({
        required: false,
        default: 1
    })
    @IsNumber()
    @IsOptional()
    carType: number

    @ApiProperty({
        default: [
            {
                "longitude": 105.7860011,
                "latitude": 21.0299603,
                "address": "Tầng 11 Thành Công Building, 80 P. Dịch Vọng Hậu, Dịch Vọng Hậu, Cầu Giấy, Hà Nội, Vietnam",
                "note": null,
                "googleId": "ChIJbzbSrSqrNTER_N28zFBgNhE",
                "referenceId": "ChIJbzbSrSqrNTER_N28zFBgNhE",
                "addressName": "Công ty cổ phần Công nghệ thông tin YooPay Việt Nam"
            },
            {
                "longitude": 105.8346667,
                "latitude": 21.0368973,
                "address": "2 Hùng Vương, Điện Biên, Ba Đình, Hà Nội 100000, Vietnam",
                "note": null,
                "googleId": "ChIJtUXBXqGrNTERWQijhBhESRs",
                "referenceId": "ChIJtUXBXqGrNTERWQijhBhESRs",
                "addressName": "2 Hùng Vương"
            }
        ],
        required: false
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTripLocationDto)
    @IsOptional()
    locations: CreateTripLocationDto[]

    @ApiProperty({
        default: false,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    isTripLater: boolean;

    @ApiProperty({
        default: null,
        required: false
    })
    @IsOptional()
    @IsDateString()
    startTime: Date

    @ApiProperty({
        required: true,
        default: false
    })
    @IsOptional()
    @IsBoolean()
    isSilent: boolean;

    @ApiProperty({
        required: false
    })
    @IsOptional()
    @IsString()
    noteForDriver: string;
}
