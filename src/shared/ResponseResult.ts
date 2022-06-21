import { HttpStatus } from "@nestjs/common";

export class ResponseResult
{
    status: number = HttpStatus.OK;
    errorMessage: string = "";
    data:any;
}