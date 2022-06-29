import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
export class NoteForDriverDto {
    @ApiProperty({
        required: false
        })
    @IsOptional()
    @IsString()
    noteForDriver: string;
}