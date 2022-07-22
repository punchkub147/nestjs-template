import {
  BadRequestException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  EntityNotFoundError,
  QueryFailedError,
  CannotCreateEntityIdMapError,
} from 'typeorm';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = (exception as any).message.message;

    switch (exception.constructor) {
      case HttpException:
      case BadRequestException:
        status = (exception as HttpException).getStatus();
        message = (exception as HttpException).getResponse()['message'];
        break;
      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        break;
      case EntityNotFoundError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as EntityNotFoundError).message;
        break;
      case CannotCreateEntityIdMapError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as CannotCreateEntityIdMapError).message;
        break;
      case UnauthorizedException:
        status = (exception as UnauthorizedException).getStatus();
        message = (exception as UnauthorizedException).message;
        break;
      default:
        console.log('🚀 ~ exception.constructor', exception.constructor);
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = (exception as HttpException).message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
