import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {Administrator} from '../models';
import {AdministratorRepository} from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({
  tags: {key: AdministratorBeforeSaveInterceptor.BINDING_KEY},
})
export class AdministratorBeforeSaveInterceptor
  implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${AdministratorBeforeSaveInterceptor.name}`;

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
    if (
      ['create', 'update', 'updateById', 'updateAll', 'replaceById'].indexOf(
        invocationCtx.methodName,
      ) < 0
    ) {
      return next();
    }
    let argIdx = 0;
    let id: string;
    switch (invocationCtx.methodName) {
      case 'updateById':
      case 'replaceById':
        argIdx = 1;
        id = invocationCtx.args[0];
    }
    const data = invocationCtx.args[argIdx];
    if (!data) {
      return next();
    }
    const process = async (administratorData: Partial<Administrator>) => {
      if (!administratorData.email) {
        return;
      }
      const administratorRepository = invocationCtx.target as AdministratorRepository;
      // neq filter not working see https://github.com/strongloop/loopback-next/issues/6518
      // let where: Where<Administrator> = {email: administratorData.email};
      // const dataId = id ?? administratorData.id;
      // if (dataId) {
      //   where = {and: [{id: {neq: dataId}}, where]};
      // }
      // const x = await administratorRepository.findOne({
      //   where,
      // });
      const admins = await administratorRepository.find({
        where: {email: administratorData.email},
      });
      if (admins.length > 1) {
        throw new HttpErrors.Conflict();
      }
      if (admins.length === 0) {
        return;
      }
      const dataId = id ?? administratorData.id;
      if (dataId && admins[0].id === dataId) {
        return;
      }
      throw new HttpErrors.Conflict();
    };
    if (data instanceof Object) {
      await process(data);
    } else if (data instanceof Array) {
      for (const e of data) {
        await process(e);
      }
    }

    const result = await next();
    // Add post-invocation logic here
    return result;
  }
}
