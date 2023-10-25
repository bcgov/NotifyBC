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

// file ported
import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {NotificationRepository} from '../repositories';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: NotificationAccessInterceptor.BINDING_KEY}})
export class NotificationAccessInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${NotificationAccessInterceptor.name}`;

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
    const notificationRepository =
      invocationCtx.target as NotificationRepository;
    const httpCtx = invocationCtx.parent;
    if (
      await notificationRepository.isAdminReq(httpCtx, undefined, undefined)
    ) {
      const result = await next();
      // Add post-invocation logic here
      return result;
    }
    const currUser = await notificationRepository.getCurrentUser(httpCtx);
    if (!currUser) {
      throw new HttpErrors[403]();
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
        {channel: 'inApp'},
        {or: [{isBroadcast: true}, {userChannelId: currUser}]},
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
