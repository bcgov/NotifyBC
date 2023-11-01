import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { decode } from 'js-base64';
import jwt from 'jsonwebtoken';
import { AppConfigService } from 'src/config/app-config.service';
import { OidcDiscoveryService } from 'src/observers/oidc-discovery.service';
import { AuthnStrategy, Role } from './constants';

@Injectable()
export class OidcAuthnStrategyMiddleware implements NestMiddleware {
  private readonly appConfig;
  constructor(private readonly appConfigService: AppConfigService) {
    this.appConfig = appConfigService.get();
  }

  use(req: any, res: Response, next: () => void) {
    if (req.user) return next();
    if (!OidcDiscoveryService?.certs?.keys) {
      return next();
    }
    const token = this.extractToken(req);
    if (!token) {
      return next();
    }
    let keyId: number;
    if (
      OidcDiscoveryService.certs.keys instanceof Array &&
      OidcDiscoveryService.certs.keys.length === 1
    ) {
      keyId = 0;
    } else {
      const encodedHeader = token.split('.')[0];
      const header = decode(encodedHeader);
      const headerObj = JSON.parse(header);
      const kid = headerObj.kid;
      keyId = (OidcDiscoveryService.certs.keys as []).findIndex(
        (e: any) => e.kid === kid,
      );
      if (keyId === -1) return next();
    }

    const certObj = OidcDiscoveryService.certs.keys[keyId];
    let cert = certObj.x5c;
    if (!cert) return;
    if (typeof cert === 'string') {
      cert = [cert];
    }
    let pem = '-----BEGIN CERTIFICATE-----\n';
    pem += cert[0] + '\n';
    pem += '-----END CERTIFICATE-----\n';

    let decodedPayload;
    try {
      decodedPayload = jwt.verify(token, pem);
    } catch (ex) {
      throw new HttpException(ex, HttpStatus.BAD_REQUEST);
    }
    let role;
    if (!this.appConfig.oidc?.isAuthorizedUser) {
      role = Role.AuthenticatedUser;
    } else if (
      this.appConfig.oidc?.isAuthorizedUser &&
      this.appConfig.oidc.isAuthorizedUser instanceof Function &&
      this.appConfig.oidc.isAuthorizedUser(decodedPayload)
    ) {
      role = Role.AuthenticatedUser;
    }
    if (
      this.appConfig.oidc?.isAdmin &&
      this.appConfig.oidc.isAdmin instanceof Function &&
      this.appConfig.oidc.isAdmin(decodedPayload)
    ) {
      role = Role.Admin;
    }
    if (!role) return next();
    req.user = {
      securityId: decodedPayload.email || decodedPayload.preferred_username,
      role,
      authnStrategy: AuthnStrategy.OIDC,
      // ...decodedPayload,
    };
    return next();
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
