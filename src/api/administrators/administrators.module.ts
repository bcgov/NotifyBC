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
