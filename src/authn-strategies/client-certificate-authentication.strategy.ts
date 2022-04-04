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
import {TLSSocket} from 'tls';

export class ClientCertificateAuthenticationStrategy
  implements AuthenticationStrategy
{
  name = 'clientCertificate';
  constructor() {}

  async authenticate(request: Request): Promise<UserProfile | undefined> {
    if (!(request.connection instanceof TLSSocket)) {
      return undefined;
    }
    const socket = request.connection as TLSSocket;
    if (!socket.authorized) {
      return undefined;
    }
    const cert = socket.getPeerCertificate();
    return {
      [securityId]: cert.subject.CN,
      authnStrategy: this.name,
      ...cert,
    };
  }
}
