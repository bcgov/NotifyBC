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
