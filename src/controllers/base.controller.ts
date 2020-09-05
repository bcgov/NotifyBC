import {inject} from '@loopback/context';
import {ApplicationConfig, CoreBindings} from '@loopback/core';
const ipRangeCheck = require('ip-range-check');

export class BaseController {
  constructor() {}

  @inject(CoreBindings.APPLICATION_CONFIG)
  private appConfig: ApplicationConfig;

  isAdminReq(
    httpCtx: any,
    ignoreAccessToken: boolean,
    ignoreSurrogate: boolean,
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
}
