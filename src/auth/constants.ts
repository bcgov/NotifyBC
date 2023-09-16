// export const securityId = Symbol('securityId');
// export const role = Symbol('role');
// export const authnStrategy = Symbol('authnStrategy');

export enum Role {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  AuthenticatedUser = 'AuthenticatedUser',
}

export enum AuthnStrategy {
  Ip = 'Ip',
}
