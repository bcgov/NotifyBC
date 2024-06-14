// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
import mongoose, { MongooseError } from 'mongoose';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((exception) => {
        if (exception instanceof HttpException) throw exception;
        if (
          exception instanceof MongooseError ||
          exception instanceof MongoServerError ||
          exception instanceof mongoose.mongo.MongoServerError
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
