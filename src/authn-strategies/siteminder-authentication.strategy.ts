import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {MiddlewareContext, Request, RestBindings} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {ConfigurationRepository} from '../repositories';

export class SiteMinderAuthenticationStrategy
  implements AuthenticationStrategy {
  name = 'siteMinder';
  constructor(
    @inject('repositories.ConfigurationRepository')
    public configurationRepository: ConfigurationRepository,
    @inject(RestBindings.Http.CONTEXT)
    protected httpContext: MiddlewareContext,
  ) {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let userProfile: UserProfile | undefined;
    const currUser = await this.configurationRepository.getCurrentUser(
      this.httpContext,
    );
    if (currUser) {
      userProfile = {
        [securityId]: currUser,
        authnStrategy: this.name,
      };
    }
    return userProfile;
  }
}
