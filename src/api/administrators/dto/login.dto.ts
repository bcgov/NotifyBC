import { OmitType } from '@nestjs/swagger';
import { CreateAdministratorDto } from './create-administrator.dto';

export class LoginDto extends OmitType(CreateAdministratorDto, ['username']) {
  tokenName?: string;
  ttl?: number;
}
