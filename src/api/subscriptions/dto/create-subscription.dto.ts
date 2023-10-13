import { OmitType } from '@nestjs/swagger';
import { Subscription } from '../entities/subscription.entity';

export class CreateSubscriptionDto extends OmitType(Subscription, [
  'id',
  'created',
  'updated',
  'createdBy',
  'updatedBy',
] as const) {}
