import { PartialType } from '@nestjs/swagger';
import { CreateAccessTokenDto } from './create-access-token.dto';

export class UpdateAccessTokenDto extends PartialType(CreateAccessTokenDto) {}
