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
