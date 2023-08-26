import { PartialType } from '@nestjs/swagger';
import { CreateBounceDto } from './create-bounce.dto';

export class UpdateBounceDto extends PartialType(CreateBounceDto) {}
