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

import {ApplicationConfig, CoreBindings, Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, Entity, juggler} from '@loopback/repository';
import {MiddlewareBindings, MiddlewareContext} from '@loopback/rest';
import {SecurityBindings, UserProfile, securityId} from '@loopback/security';
const ipRangeCheck = require('ip-range-check');

export class BaseCrudRepository<
  T extends Entity,
  ID,
  Relations extends object = {},
> extends DefaultCrudRepository<T, ID, Relations> {
  constructor(
    entityClass: typeof Entity & {
      prototype: T;
    },
    dataSource: juggler.DataSource,
    @inject.getter(MiddlewareBindings.CONTEXT)
    protected getHttpContext: Getter<MiddlewareContext>,
    @inject(CoreBindings.APPLICATION_CONFIG)
    protected appConfig: ApplicationConfig,
    @inject(SecurityBindings.USER, {optional: true})
    public user?: UserProfile,
  ) {
    super(entityClass, dataSource);
  }

  async isAdminReq(
    httpCtx: any,
    ignoreAccessToken?: boolean,
    ignoreSurrogate?: boolean,
  ): Promise<boolean> {
    // internal requests
    if (!httpCtx) {
      return true;
    }
    const request = httpCtx.req || httpCtx.request;
    if (!request) {
      return true;
    }
    if (!ignoreSurrogate) {
      if (
        request.get('SM_UNIVERSALID') ||
        request.get('sm_user') ||
        request.get('smgov_userdisplayname') ||
        request.get('is_anonymous')
      ) {
        return false;
      }
    }
    if (!ignoreAccessToken) {
      try {
        const token = httpCtx.args.options?.accessToken;
        if (token?.userId) {
          return true;
        }
      } catch (ex) {}
      // start: ported
      if (
        this.user &&
        this.user.authnStrategy === 'oidc' &&
        this.appConfig.oidc?.isAdmin &&
        this.appConfig.oidc.isAdmin instanceof Function
      ) {
        return this.appConfig.oidc.isAdmin(this.user);
      }
      // end: ported
    }

    if (this.user && this.user.authnStrategy === 'clientCertificate') {
      return true;
    }

    // start: ported
    const adminIps = this.appConfig.adminIps || this.appConfig.defaultAdminIps;
    if (adminIps && adminIps.length > 0) {
      return adminIps.some(function (e: string) {
        return ipRangeCheck(request.ip, e);
      });
    }
    // end: ported

    return false;
  }

  async getCurrentUser(httpCtx: any, siteMinderOnly = false) {
    // start: ported
    if (this.user && this.user.authnStrategy === 'oidc' && !siteMinderOnly) {
      if (this.appConfig.oidc.isAuthorizedUser) {
        if (
          this.appConfig.oidc.isAuthorizedUser instanceof Function &&
          (await this.appConfig.oidc.isAuthorizedUser(this.user))
        ) {
          return this.user[securityId];
        }
      } else {
        return this.user[securityId];
      }
    }
    // end: ported
    // internal requests
    if (!httpCtx) return null;
    // start: ported
    const request = httpCtx.req || httpCtx.request;
    if (!request) return null;
    const currUser =
      request.get('SM_UNIVERSALID') ||
      request.get('sm_user') ||
      request.get('smgov_userdisplayname');
    if (!currUser) {
      return null;
    }
    if (await this.isAdminReq(httpCtx, undefined, true)) {
      return currUser;
    }
    const siteMinderReverseProxyIps = this.appConfig.siteMinderReverseProxyIps;
    if (!siteMinderReverseProxyIps || siteMinderReverseProxyIps.length <= 0) {
      return null;
    }
    // rely on express 'trust proxy' settings to obtain real ip
    const realIp = request.ip;
    const isFromSM = siteMinderReverseProxyIps.some(function (e: string) {
      return ipRangeCheck(realIp, e);
    });
    return isFromSM ? currUser : null;
    // end: ported
  }

  // start: ported
  async updateTimestamp(ctx: any) {
    let req;
    try {
      const httpCtx = await this.getHttpContext();
      req = httpCtx.request;
    } catch (ex) {}
    try {
      if (ctx.data) {
        ctx.data.updated = new Date();
        ctx.data.updatedBy = {
          ip: req?.ip,
        };
        if (this.user) {
          ctx.data.updatedBy.user = {
            securityId: this.user[securityId],
            ...this.user,
          };
        }
        if (ctx.isNewInstance) {
          ctx.data.createdBy = {
            ip: req?.ip,
          };
          if (this.user) {
            ctx.data.createdBy.user = {
              securityId: this.user[securityId],
              ...this.user,
            };
          }
        }
      }
    } catch (ex) {}
  }
  // end: ported
}
