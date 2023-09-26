import { OmitType } from '@nestjs/swagger';
import { UserCredential } from '../entities/user-credential.entity';

export class CreateUserCredentialReturnDto extends OmitType(UserCredential, [
  'updated',
  'updatedBy',
] as const) {}
