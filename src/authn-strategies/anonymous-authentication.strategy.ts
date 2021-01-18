import {AuthenticationStrategy} from '@loopback/authentication';
import {Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';

export class AnonymousAuthenticationStrategy implements AuthenticationStrategy {
  name = 'anonymous';
  constructor() {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    return {
      [securityId]: 'anonymous',
      authnStrategy: this.name,
    };
  }
}
