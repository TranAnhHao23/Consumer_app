import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>()
        // const request = ctx.getRequest<Request>()
        const status = exception.getStatus();

        const exceptionResponse = typeof exception.getResponse() == 'string' ? exception.getResponse() : exception.getResponse()?.['message'].join('. ')

        const errorMessage = exception instanceof HttpException ? exceptionResponse : 'INTERNAL_SERVER_ERROR'
        response
            .status(status)
            .json({
                status: status,
                errorMessage: errorMessage
            })
    }
}