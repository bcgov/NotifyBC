import { Module } from '@nestjs/common';
import { ConfigurationsModule } from 'src/api/configurations/configurations.module';
import { RsaService } from './rsa.service';

@Module({
  providers: [RsaService],
  imports: [ConfigurationsModule],
})
export class ObserversModule {}
