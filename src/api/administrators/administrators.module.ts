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
import { AccessTokenService } from './access-token.service';
import { AdministratorsController } from './administrators.controller';
import { AdministratorsService } from './administrators.service';
import { AccessToken, AccessTokenSchema } from './entities/access-token.entity';
import {
  Administrator,
  AdministratorSchema,
} from './entities/administrator.entity';
import {
  UserCredential,
  UserCredentialSchema,
} from './entities/user-credential.entity';
import { UserCredentialService } from './user-credential.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Administrator.name, schema: AdministratorSchema },
      { name: UserCredential.name, schema: UserCredentialSchema },
      { name: AccessToken.name, schema: AccessTokenSchema },
    ]),
  ],
  controllers: [AdministratorsController],
  providers: [AdministratorsService, AccessTokenService, UserCredentialService],
  exports: [AdministratorsService, AccessTokenService, UserCredentialService],
})
export class AdministratorsModule {}
