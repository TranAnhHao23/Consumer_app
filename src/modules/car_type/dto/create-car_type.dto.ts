import {Column} from "typeorm";

export class CreateCarTypeDto {
    typeName: string;

    typeSlogan: string;

    carImage: string;
}
