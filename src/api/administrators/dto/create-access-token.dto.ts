import { PickType } from '@nestjs/swagger';
import { AccessToken } from '../entities/access-token.entity';

export class CreateAccessTokenDto extends PickType(AccessToken, [
  'ttl',
  'name',
] as const) {}
