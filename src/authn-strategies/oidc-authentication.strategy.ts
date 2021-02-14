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

import {AuthenticationStrategy} from '@loopback/authentication';
import {Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {decode} from 'js-base64';
import {OidcDiscoveryObserver} from '../observers';
const jwt = require('jsonwebtoken');

export class OidcAuthenticationStrategy implements AuthenticationStrategy {
  name = 'oidc';
  constructor() {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    if (!OidcDiscoveryObserver.certs.keys) {
      return;
    }
    const token = this.extractToken(request);
    if (!token) {
      return;
    }
    let keyId: number;
    if (
      OidcDiscoveryObserver.certs.keys instanceof Array &&
      OidcDiscoveryObserver.certs.keys.length === 1
    ) {
      keyId = 0;
    } else {
      const encodedHeader = token.split('.')[0];
      const header = decode(encodedHeader);
      const headerObj = JSON.parse(header);
      const kid = headerObj.kid;
      keyId = (OidcDiscoveryObserver.certs.keys as []).findIndex(
        (e: any) => e.kid === kid,
      );
      if (keyId === -1) return;
    }

    const certObj = OidcDiscoveryObserver.certs.keys[keyId];
    let cert = certObj.x5c;
    if (!cert) return;
    if (typeof cert === 'string') {
      cert = [cert];
    }
    let pem = '-----BEGIN CERTIFICATE-----\n';
    pem += cert[0] + '\n';
    pem += '-----END CERTIFICATE-----\n';
    return new Promise((resolve, reject) => {
      jwt.verify(token, pem, (err: any, decodedPayload: any) => {
        err && reject(err);
        const userProfile: UserProfile = {
          [securityId]:
            decodedPayload.email || decodedPayload.preferred_username,
          authnStrategy: this.name,
          ...decodedPayload,
        };
        resolve(userProfile);
      });
    });
  }

  extractToken(request: Request): string | undefined {
    // from Authorization header
    const token = request.headers.authorization;
    if (!token) {
      return;
    }
    const parts = token.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return;
    }
    const subParts = parts[1].split('.');
    if (subParts.length !== 3) {
      return;
    }
    return parts[1];
  }
}
