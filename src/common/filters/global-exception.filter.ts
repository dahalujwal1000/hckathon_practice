import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : 500;

    const message =
      exception.response?.message ||
      exception.message ||
      'Internal server error';

    const errorCode =
      exception.response?.errorCode ||
      (status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST');

    response.status(status).json({
      success: false,
      message,
      error: {
        code: errorCode,
        details: [],
      },
    });
  }
}
