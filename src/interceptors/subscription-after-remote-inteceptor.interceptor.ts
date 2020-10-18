import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {BaseController} from '../controllers/base.controller';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({
  tags: {key: SubscriptionAfterRemoteInteceptorInterceptor.BINDING_KEY},
})
export class SubscriptionAfterRemoteInteceptorInterceptor
  implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${SubscriptionAfterRemoteInteceptorInterceptor.name}`;

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
    try {
      // Add pre-invocation logic here
      const data = await next();
      // Add post-invocation logic here
      let targetInstance = invocationCtx.target as BaseController;
      if (
        !targetInstance.configurationRepository.isAdminReq(invocationCtx.parent)
      ) {
        if (data instanceof Array) {
          data.forEach(function (e) {
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
      }
      return data;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
