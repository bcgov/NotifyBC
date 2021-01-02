import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: RepositoryBeforeSaveInterceptor.BINDING_KEY}})
export class RepositoryBeforeSaveInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${RepositoryBeforeSaveInterceptor.name}`;

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
    const baseCrudRepository: AnyObject = invocationCtx.target;
    if (
      ['create', 'update', 'updateById', 'updateAll', 'replaceById'].indexOf(
        invocationCtx.methodName,
      ) < 0
    ) {
      return next();
    }
    let argIdx = 0;
    const ctx: AnyObject = {isNewInstance: false};
    switch (invocationCtx.methodName) {
      case 'updateById':
      case 'replaceById':
        argIdx = 1;
        break;
      case 'create':
        ctx.isNewInstance = true;
        break;
    }
    const data = invocationCtx.args[argIdx];
    if (!data) {
      return next();
    }
    if (data instanceof Object) {
      await baseCrudRepository.updateTimestamp(
        Object.assign({}, ctx, {data: data}),
      );
    } else if (data instanceof Array) {
      for (const e of data) {
        baseCrudRepository.updateTimestamp(Object.assign({}, ctx, {data: e}));
      }
    }

    const result = await next();
    // Add post-invocation logic here
    return result;
  }
}
