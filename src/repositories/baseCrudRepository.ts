import {ApplicationConfig, CoreBindings, Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  Entity,
  juggler,
  Model,
} from '@loopback/repository';
import {MiddlewareBindings, MiddlewareContext} from '@loopback/rest';
const ipRangeCheck = require('ip-range-check');

export class BaseCrudRepository<
  T extends Entity,
  ID,
  Relations extends object = {}
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
  ) {
    super(entityClass, dataSource);
  }

  isAdminReq(
    httpCtx: any,
    ignoreAccessToken?: boolean,
    ignoreSurrogate?: boolean,
  ): boolean {
    // internal requests
    if (!httpCtx) {
      return true;
    }
    const request = httpCtx.req || httpCtx.request;
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
        const token = httpCtx.args.options && httpCtx.args.options.accessToken;
        if (token && token.userId) {
          return true;
        }
      } catch (ex) {}
    }

    const adminIps = this.appConfig.adminIps || this.appConfig.defaultAdminIps;
    if (adminIps) {
      return adminIps.some(function (e: string) {
        return ipRangeCheck(request.ip, e);
      });
    }
    return false;
  }

  getCurrentUser(httpCtx: any) {
    // internal requests
    if (!httpCtx) return null;
    const request = httpCtx.req || httpCtx.request;
    var currUser =
      request.get('SM_UNIVERSALID') ||
      request.get('sm_user') ||
      request.get('smgov_userdisplayname');
    if (!currUser) {
      return null;
    }
    if (this.isAdminReq(httpCtx, undefined, true)) {
      return currUser;
    }
    var siteMinderReverseProxyIps =
      this.appConfig.siteMinderReverseProxyIps ||
      this.appConfig.defaultSiteMinderReverseProxyIps;
    if (!siteMinderReverseProxyIps || siteMinderReverseProxyIps.length <= 0) {
      return null;
    }
    // rely on express 'trust proxy' settings to obtain real ip
    var realIp = request.ip;
    var isFromSM = siteMinderReverseProxyIps.some(function (e: string) {
      return ipRangeCheck(realIp, e);
    });
    return isFromSM ? currUser : null;
  }

  protected definePersistedModel(
    entityClass: typeof Model,
  ): typeof juggler.PersistedModel {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      let req;
      try {
        const httpCtx = await this.getHttpContext();
        req = httpCtx.request;
      } catch (ex) {}
      let token;
      try {
        // todo: obtain access token
        token =
          ctx.options.httpContext.args.options &&
          ctx.options.httpContext.args.options.accessToken;
      } catch (ex) {}
      try {
        if (ctx.instance) {
          ctx.instance.updated = new Date();
          ctx.instance.updatedBy = {
            ip: req && req.ip,
            eventSrc: ctx.options.eventSrc,
          };
          if (token && token.userId) {
            ctx.instance.updatedBy.adminUser = token.userId;
          }
          if (ctx.isNewInstance) {
            ctx.instance.createdBy = {
              ip: req && req.ip,
            };
            if (token && token.userId) {
              ctx.instance.createdBy.adminUser = token.userId;
            }
          }
        } else if (ctx.data) {
          ctx.data.updated = new Date();
          ctx.data.updatedBy = {
            ip: req && req.ip,
            eventSrc: ctx.options.eventSrc,
          };
          if (token && token.userId) {
            ctx.data.updatedBy.adminUser = token.userId;
          }
          if (ctx.isNewInstance) {
            ctx.data.createdBy = {
              ip: req && req.ip,
            };
            if (token && token.userId) {
              ctx.data.createdBy.adminUser = token.userId;
            }
          }
        }
      } catch (ex) {}
    });
    return modelClass;
  }
}
