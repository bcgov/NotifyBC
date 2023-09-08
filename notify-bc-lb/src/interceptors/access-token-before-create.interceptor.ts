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

import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import cryptoRandomString from 'crypto-random-string';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
// file ported
@injectable({tags: {key: AccessTokenBeforeCreateInterceptor.BINDING_KEY}})
export class AccessTokenBeforeCreateInterceptor
  implements Provider<Interceptor>
{
  static readonly BINDING_KEY = `interceptors.${AccessTokenBeforeCreateInterceptor.name}`;

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
    if (['create'].indexOf(invocationCtx.methodName) < 0) {
      return next();
    }
    const id = cryptoRandomString({length: 64, type: 'alphanumeric'});
    invocationCtx.args[0].id = id;
    const result = await next();
    // Add post-invocation logic here
    return result;
  }
}
