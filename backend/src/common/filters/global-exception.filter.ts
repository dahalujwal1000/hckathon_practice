import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();

      response.status(status).json({
        success: false,
        message: typeof message === 'string' ? message : 'Error occurred',
        error: {
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      });
    } else {
      // Handle non-HTTP exceptions
      response.status(500).json({
        success: false,
        message: 'Internal server error',
        error: {
          statusCode: 500,
          timestamp: new Date().toISOString(),
          path: request.url,
        },
      });
    }
  }
}