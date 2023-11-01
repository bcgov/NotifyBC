import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdministratorsModule } from 'src/api/administrators/administrators.module';
import { ObserversModule } from 'src/observers/observers.module';
import { AccessTokenAuthnStrategyMiddleware } from './access-token-authn-strategy.middleware';
import { IpAuthnStrategyMiddleware } from './ip-authn-strategy.middleware';
import { OidcAuthnStrategyMiddleware } from './oidc-authn-strategy.middleware';
import { RolesGuard } from './roles.guard';
import { SiteminderAuthnStrategyMiddleware } from './siteminder-authn-strategy.middleware';

@Module({
  imports: [AdministratorsModule, ObserversModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        AccessTokenAuthnStrategyMiddleware,
        OidcAuthnStrategyMiddleware,
        SiteminderAuthnStrategyMiddleware,
        IpAuthnStrategyMiddleware,
      )
      .forRoutes('*');
  }
}
