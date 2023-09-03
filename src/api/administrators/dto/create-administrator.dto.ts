import { OmitType } from '@nestjs/swagger';
import { Administrator } from '../entities/administrator.entity';

export class CreateAdministratorDto extends OmitType(Administrator, [
  'id',
  'created',
  'updated',
] as const) {}
