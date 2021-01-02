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
@injectable({tags: {key: SubscriptionAccessInterceptor.BINDING_KEY}})
export class SubscriptionAccessInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${SubscriptionAccessInterceptor.name}`;

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
    const httpCtx = invocationCtx.parent;
    const subscriptionRepository = invocationCtx.target as SubscriptionRepository;
    const u = await subscriptionRepository.getCurrentUser(httpCtx);
    if (!u) {
      return next();
    }
    if (
      ['find', 'findOne', 'count', 'updateAll', 'deleteAll'].indexOf(
        invocationCtx.methodName,
      ) < 0
    ) {
      return next();
    }
    let argIdx = 0;
    enum ArgType {
      Filter,
      Where,
    }
    let argType: ArgType = ArgType.Filter;
    switch (invocationCtx.methodName) {
      case 'count':
        argType = ArgType.Where;
        break;
      case 'updateAll':
        argIdx = 1;
        argType = ArgType.Where;
        break;
      case 'deleteAll':
        argType = ArgType.Where;
        break;
      default:
    }
    invocationCtx.args[argIdx] = invocationCtx.args[argIdx] || {};
    if (argType === ArgType.Filter) {
      invocationCtx.args[argIdx].where = invocationCtx.args[argIdx].where || {};
    }
    let whereClause =
      argType === ArgType.Filter
        ? invocationCtx.args[argIdx].where
        : invocationCtx.args[argIdx];
    whereClause = {
      and: [
        whereClause,
        {userId: u},
        {
          state: {
            neq: 'deleted',
          },
        },
      ],
    };
    if (argType === ArgType.Filter) {
      invocationCtx.args[argIdx].where = whereClause;
    } else {
      invocationCtx.args[argIdx] = whereClause;
    }
    const result = await next();
    // Add post-invocation logic here
    return result;
  }
}
