import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdministratorsModule } from 'src/api/administrators/administrators.module';
import { AccessTokenAuthnStrategyMiddleware } from './access-token-authn-strategy.middleware';
import { IpAuthnStrategyMiddleware } from './ip-authn-strategy.middleware';

@Module({
  imports: [AdministratorsModule],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AccessTokenAuthnStrategyMiddleware, IpAuthnStrategyMiddleware)
      .forRoutes('*');
  }
}
