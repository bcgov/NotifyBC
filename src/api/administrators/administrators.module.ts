import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessTokenService } from './access-token.service';
import { AdministratorsController } from './administrators.controller';
import { AdministratorsService } from './administrators.service';
import {
  Administrator,
  AdministratorSchema,
} from './entities/administrator.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Administrator.name, schema: AdministratorSchema },
    ]),
  ],
  controllers: [AdministratorsController],
  providers: [AdministratorsService, AccessTokenService],
  exports: [AdministratorsService, AccessTokenService],
})
export class AdministratorsModule {}
