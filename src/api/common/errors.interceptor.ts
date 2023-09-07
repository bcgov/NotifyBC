import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { MongooseError } from 'mongoose';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((exception) => {
        if (exception instanceof HttpException) throw exception;
        if (
          exception instanceof MongooseError ||
          exception instanceof MongoServerError
        )
          throw new HttpException(exception.message, HttpStatus.BAD_REQUEST, {
            cause: exception,
          });
        Logger.error(
          exception,
          `${context.getClass().name}.${context.getHandler().name}`,
        );
        throw exception;
      }),
    );
  }
}
