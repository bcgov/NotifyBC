import { Controller, Get, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { Role } from 'src/auth/constants';
import { Roles } from 'src/auth/roles.decorator';
import { CountDto } from '../common/dto/count.dto';
import { ApiWhereJsonQuery, JsonQuery } from '../common/json-query.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@ApiTags('notification')
@Roles(Role.Admin, Role.SuperAdmin, Role.AuthenticatedUser)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('count')
  @ApiOkResponse({
    description: 'Notification model count',
    type: CountDto,
  })
  @ApiWhereJsonQuery()
  async count(
    @Req() req,
    @JsonQuery('where')
    where?: FilterQuery<Notification>,
  ): Promise<CountDto> {
    return this.notificationsService.count(where);
  }
}
