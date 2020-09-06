import {inject} from '@loopback/context';
import {ApplicationConfig, CoreBindings} from '@loopback/core';
const ipRangeCheck = require('ip-range-check');

export class BaseController {
  constructor() {}

  @inject(CoreBindings.APPLICATION_CONFIG)
  private appConfig: ApplicationConfig;

  isAdminReq(
    httpCtx: any,
    ignoreAccessToken?: boolean,
    ignoreSurrogate?: boolean,
  ): boolean {
    // internal requests
    if (!httpCtx || !httpCtx.req) {
      return true;
    }
    if (!ignoreSurrogate) {
      if (
        httpCtx.req.get('SM_UNIVERSALID') ||
        httpCtx.req.get('sm_user') ||
        httpCtx.req.get('smgov_userdisplayname') ||
        httpCtx.req.get('is_anonymous')
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
        return ipRangeCheck(httpCtx.req.ip, e);
      });
    }
    return false;
  }

  getCurrentUser(httpCtx: any) {
    // internal requests
    if (!httpCtx) return null;

    var currUser =
      httpCtx.req.get('SM_UNIVERSALID') ||
      httpCtx.req.get('sm_user') ||
      httpCtx.req.get('smgov_userdisplayname');
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
    var realIp = httpCtx.req.ip;
    var isFromSM = siteMinderReverseProxyIps.some(function (e: string) {
      return ipRangeCheck(realIp, e);
    });
    return isFromSM ? currUser : null;
  }
}
