import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Administrator } from '../entities/administrator.entity';
import { PASSWORD_COMPLEXITY_REGEX } from '../entities/user-credential.entity';

export class CreateAdministratorDto extends OmitType(Administrator, [
  'id',
  'created',
  'updated',
  'createdBy',
  'updatedBy',
] as const) {
  @ApiProperty({ pattern: PASSWORD_COMPLEXITY_REGEX })
  password: string;
}
