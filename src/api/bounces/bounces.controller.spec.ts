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

import { Test, TestingModule } from '@nestjs/testing';
import { BouncesController } from './bounces.controller';
import { BouncesService } from './bounces.service';

describe('BouncesController', () => {
  let controller: BouncesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BouncesController],
      providers: [BouncesService],
    }).compile();

    controller = module.get<BouncesController>(BouncesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
