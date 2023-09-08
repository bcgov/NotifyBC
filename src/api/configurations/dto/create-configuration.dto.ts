import { OmitType } from '@nestjs/swagger';
import { Configuration } from '../entities/configuration.entity';

export class CreateConfigurationDto extends OmitType(Configuration, [
  'id',
  'created',
  'updated',
  'createdBy',
  'updatedBy',
] as const) {}
