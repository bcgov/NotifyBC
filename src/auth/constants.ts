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
  OIDC = 'oidc',
  ClientCertificate = 'clientCertificate',
}

export const ROLES_KEY = 'roles';
