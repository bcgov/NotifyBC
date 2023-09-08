import { OmitType } from '@nestjs/swagger';
import { Bounce } from '../entities/bounce.entity';

export class CreateBounceDto extends OmitType(Bounce, [
  'id',
  'created',
  'updated',
  'createdBy',
  'updatedBy',
] as const) {}
