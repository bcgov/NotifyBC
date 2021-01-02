import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {BaseController} from '../controllers/base.controller';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: AdminInterceptor.BINDING_KEY}})
export class AdminInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${AdminInterceptor.name}`;

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
    const targetInstance = invocationCtx.target as BaseController;
    if (
      !(await targetInstance.configurationRepository.isAdminReq(
        invocationCtx.parent,
        undefined,
        undefined,
      ))
    ) {
      throw new HttpErrors[403]('Forbidden');
    }

    const result = await next();
    // Add post-invocation logic here
    return result;
  }
}
