import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {SubscriptionRepository} from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({
  tags: {key: SubscriptionAfterRemoteInterceptor.BINDING_KEY},
})
export class SubscriptionAfterRemoteInterceptor
  implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${SubscriptionAfterRemoteInterceptor.name}`;

  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    // Add pre-invocation logic here
    const data = await next();
    // Add post-invocation logic here
    const targetInstance = invocationCtx.target as SubscriptionRepository;
    if (
      await targetInstance.isAdminReq(
        invocationCtx.parent,
        undefined,
        undefined,
      )
    ) {
      return data;
    }

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
  }
}
