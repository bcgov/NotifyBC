import { AuthnStrategy, Role } from '../constants';

export class UserProfile {
  securityId: string;
  authnStrategy: AuthnStrategy;
  role?: Role;
}
