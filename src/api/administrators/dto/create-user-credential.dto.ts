import { PickType } from '@nestjs/swagger';
import { UserCredential } from '../entities/user-credential.entity';

export class CreateUserCredentialDto extends PickType(UserCredential, [
  'password',
] as const) {}
