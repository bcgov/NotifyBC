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
  ApplicationConfig,
  CoreBindings,
  Getter,
  inject,
  intercept,
} from '@loopback/core';
import {MiddlewareContext, RestBindings} from '@loopback/rest';
import {SecurityBindings, UserProfile} from '@loopback/security';
import {DbDataSource} from '../datasources';
import {
  NotificationAccessInterceptor,
  RepositoryBeforeSaveInterceptor,
} from '../interceptors';
import {Notification, NotificationRelations} from '../models';
import {BaseCrudRepository} from './baseCrudRepository';

@intercept(RepositoryBeforeSaveInterceptor.BINDING_KEY)
@intercept(NotificationAccessInterceptor.BINDING_KEY)
export class NotificationRepository extends BaseCrudRepository<
  Notification,
  typeof Notification.prototype.id,
  NotificationRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @inject.getter(RestBindings.Http.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
    @inject(SecurityBindings.USER, {optional: true})
    public user?: UserProfile,
  ) {
    super(Notification, dataSource, getHttpContext, appConfig, user);
  }
}
