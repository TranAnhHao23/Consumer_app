import { HttpStatus } from "@nestjs/common";

export class ResponseResult {
    constructor(_status: number = HttpStatus.OK) {
        this.status = _status;
    }
    status: number;
    errorMessage: string = "";
    data: any;
}