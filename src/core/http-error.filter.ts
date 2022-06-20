import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  Logger,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log(exception.constructor);
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    // const status = exception.getStatus();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let msg = '';
    console.log(exception);
    switch (exception.constructor) {
      case HttpException:
        status = (exception as HttpException).getStatus();
        msg = exception.message;
        break;
      case BadRequestException:
        status = (exception as BadRequestException).getStatus();
        const res: any = (exception as BadRequestException).getResponse();
        msg = res.message[0] || res.message || null;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const errorResponse = {
      resultCode: status,
      // timestamp: new Date().toLocaleDateString(),
      // path: request.url,
      // method: request.method,
      errorMessage: msg || null,
      status: 'FAILED',
      data: {},
    };
    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
