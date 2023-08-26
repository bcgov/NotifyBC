import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigurationsModule } from './api/configurations/configurations.module';

@Module({
  imports: [ConfigModule, ConfigurationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
