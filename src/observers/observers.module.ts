import { Module } from '@nestjs/common';
import { RsaService } from './rsa.service';

@Module({
  providers: [RsaService]
})
export class ObserversModule {}
