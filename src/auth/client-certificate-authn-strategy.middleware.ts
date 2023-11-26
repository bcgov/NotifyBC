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

import { Injectable, NestMiddleware } from '@nestjs/common';
import { TLSSocket } from 'tls';
import { AuthnStrategy, Role } from './constants';

@Injectable()
export class ClientCertificateAuthnStrategyMiddleware
  implements NestMiddleware
{
  use(req: any, res: any, next: () => void) {
    if (!(req.connection instanceof TLSSocket)) {
      return next();
    }
    const socket = req.connection as TLSSocket;
    if (!socket.authorized) {
      return next();
    }
    const cert = socket.getPeerCertificate();
    req.user = {
      securityId: cert.subject.CN,
      authnStrategy: AuthnStrategy.ClientCertificate,
      role: Role.SuperAdmin,
      // ...cert,
    };
    return next();
  }
}
