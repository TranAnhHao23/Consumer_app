import {ApiProperty} from "@nestjs/swagger";
import {IsString} from "class-validator";

export class DriverAppFindDriverResponseDto {
    @ApiProperty({

    })
    @IsString()
    bookingId: string;

    @ApiProperty({

    })
    status: number

    @ApiProperty({

    })
    driverInfoId: string;

    @ApiProperty({

    })
    carInfoId: string;

}
