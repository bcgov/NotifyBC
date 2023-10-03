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
            delete e.confirmationRequest;
            delete e.updatedBy;
            delete e.createdBy;
            delete e.unsubscriptionCode;
          });
        } else if (data instanceof Object) {
          delete data.confirmationRequest;
          delete data.updatedBy;
          delete data.createdBy;
          delete data.unsubscriptionCode;
        }
        return data;
      }),
    );
  }
}
