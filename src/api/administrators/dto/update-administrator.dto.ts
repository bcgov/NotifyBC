import { PartialType } from '@nestjs/swagger';
import { CreateAdministratorDto } from './create-administrator.dto';

export class UpdateAdministratorDto extends PartialType(CreateAdministratorDto) {}
