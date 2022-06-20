import {Column} from "typeorm";
import {IsNotEmpty} from "class-validator";

export class CreateCarTypeDto {
    @IsNotEmpty()
    typeName: string;

    @IsNotEmpty()
    typeSlogan: string;

    @IsNotEmpty()
    carImage: string;
}
