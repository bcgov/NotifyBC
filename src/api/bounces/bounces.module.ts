import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BouncesController } from './bounces.controller';
import { BouncesService } from './bounces.service';
import {
  BounceMessageItem,
  BounceMessageItemSchema,
} from './entities/bounce-message-item.entity';
import { Bounce, BounceSchema } from './entities/bounce.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bounce.name, schema: BounceSchema },
      { name: BounceMessageItem.name, schema: BounceMessageItemSchema },
    ]),
  ],
  controllers: [BouncesController],
  providers: [BouncesService],
  exports: [BouncesService],
})
export class BouncesModule {}
