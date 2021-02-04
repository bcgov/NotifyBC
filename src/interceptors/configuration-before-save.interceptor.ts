import {
  ApplicationConfig,
  CoreBindings,
  inject,
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {AnyObject} from '@loopback/repository';
import {MiddlewareContext} from '@loopback/rest';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: ConfigurationBeforeSaveInterceptor.BINDING_KEY}})
export class ConfigurationBeforeSaveInterceptor
  implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${ConfigurationBeforeSaveInterceptor.name}`;

  constructor(
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
  ) {}

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
    if (
      ['create', 'update', 'updateById', 'updateAll', 'replaceById'].indexOf(
        invocationCtx.methodName,
      ) < 0
    ) {
      return next();
    }
    let argIdx = 0;
    switch (invocationCtx.methodName) {
      case 'updateById':
      case 'replaceById':
        argIdx = 1;
    }
    const data = invocationCtx.args[argIdx];
    if (!data) {
      return next();
    }
    const updateHttpHost = (configurationData: AnyObject) => {
      if (
        configurationData.name === 'notification' &&
        configurationData.value &&
        configurationData.value.rss &&
        !configurationData.value.httpHost &&
        !this.appConfig.httpHost
      ) {
        const httpCtx = invocationCtx.parent as MiddlewareContext;
        configurationData.value.httpHost =
          httpCtx.request.protocol + '://' + httpCtx.request.get('host');
      }
    };
    if (data instanceof Object) {
      updateHttpHost(data);
    } else if (data instanceof Array) {
      for (const e of data) {
        updateHttpHost(e);
      }
    }

    const result = await next();
    // Add post-invocation logic here
    return result;
  }
}
