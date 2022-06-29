import { ApiProperty } from "@nestjs/swagger";
export class NoteForDriverDto {
    @ApiProperty({
        required: true
        })
    noteForDriver: string;
}