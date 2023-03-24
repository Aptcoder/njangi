import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Logger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: Logger) {}
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Something unexpected occurred';

    if (typeof message != 'string') {
      message = (message as HttpException['response']).message;
      if (message instanceof Array) {
        message = message[0];
      }
    }
    this.logger.error(exception);
    return response.status(status).json({
      status: false,
      message: message,
      data: {},
    });
  }
}
