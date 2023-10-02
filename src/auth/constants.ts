// export const securityId = Symbol('securityId');
// export const role = Symbol('role');
// export const authnStrategy = Symbol('authnStrategy');

export enum Role {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  AuthenticatedUser = 'AuthenticatedUser',
  Anonymous = 'Anonymous',
}

export enum AuthnStrategy {
  Ip = 'Ip',
  AccessToken = 'accessToken',
  SiteMinder = 'siteMinder',
}

export const ROLES_KEY = 'roles';
