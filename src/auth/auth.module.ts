import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IpAuthnStrategyMiddleware } from './ip-authn-strategy.middleware';

@Module({})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpAuthnStrategyMiddleware).forRoutes('*');
  }
}
