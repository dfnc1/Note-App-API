import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';
import { Response } from 'express';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';

type FilterException = HttpException | ZodError | Error;

@Catch(ZodError, HttpException, TokenExpiredError, JsonWebTokenError)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: FilterException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      response.status(400).json({
        errors: 'Validation error',
      });
    } else if (exception instanceof TokenExpiredError) {
      response.status(400).json({
        errors: 'Token Expired Error',
      });
    } else if (exception instanceof JsonWebTokenError) {
      response.status(400).json({
        errors: 'Jwt Error',
      });
    } else {
      response.status(500).json({
        errors: exception.message,
      });
    }
  }
}
