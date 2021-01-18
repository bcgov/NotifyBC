import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {MiddlewareContext, Request, RestBindings} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {ConfigurationRepository} from '../repositories';

export class IpWhitelistAuthenticationStrategy
  implements AuthenticationStrategy {
  name = 'ipWhitelist';
  constructor(
    @inject('repositories.ConfigurationRepository')
    public configurationRepository: ConfigurationRepository,
    @inject(RestBindings.Http.CONTEXT)
    protected httpContext: MiddlewareContext,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let userProfile: UserProfile | undefined;
    if (
      await this.configurationRepository.isAdminReq(
        this.httpContext,
        true,
        true,
      )
    ) {
      userProfile = {
        [securityId]: request.ip,
        authnStrategy: this.name,
      };
    }
    return userProfile;
  }
}
