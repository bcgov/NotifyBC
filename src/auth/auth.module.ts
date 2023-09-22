import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AdministratorsModule } from 'src/api/administrators/administrators.module';
import { AccessTokenAuthnStrategyMiddleware } from './access-token-authn-strategy.middleware';
import { IpAuthnStrategyMiddleware } from './ip-authn-strategy.middleware';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [AdministratorsModule],
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
      .apply(AccessTokenAuthnStrategyMiddleware, IpAuthnStrategyMiddleware)
      .forRoutes('*');
  }
}
