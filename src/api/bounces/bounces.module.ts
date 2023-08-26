import { Module } from '@nestjs/common';
import { BouncesService } from './bounces.service';
import { BouncesController } from './bounces.controller';

@Module({
  controllers: [BouncesController],
  providers: [BouncesService],
})
export class BouncesModule {}
