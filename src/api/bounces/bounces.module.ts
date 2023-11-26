// Copyright 2016-present Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
