import { Module } from '@nestjs/common';
import { ConfigurationsModule } from 'src/api/configurations/configurations.module';
import { IndexDBSchemaService } from './index-dbschema.service';
import { RsaService } from './rsa.service';

@Module({
  providers: [RsaService, IndexDBSchemaService],
  imports: [ConfigurationsModule],
})
export class ObserversModule {}
