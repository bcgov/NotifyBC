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
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Role } from 'src/auth/constants';

@Injectable()
export class SubscriptionAfterRemoteInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const httpCtx = context.switchToHttp();
        const req = httpCtx.getRequest();
        if ([Role.SuperAdmin, Role.Admin].includes(req?.user?.role))
          return data;
        if (data instanceof Array) {
          data.forEach(function (e) {
            if (!(e instanceof Object)) return;
            e.confirmationRequest = undefined;
            e.updatedBy = undefined;
            e.createdBy = undefined;
            e.unsubscriptionCode = undefined;
          });
        } else if (data instanceof Object) {
          data.confirmationRequest = undefined;
          data.updatedBy = undefined;
          data.createdBy = undefined;
          data.unsubscriptionCode = undefined;
        }
        return data;
      }),
    );
  }
}
