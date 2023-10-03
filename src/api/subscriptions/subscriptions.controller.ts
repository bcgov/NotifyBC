import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { Role } from 'src/auth/constants';
import { Roles } from 'src/auth/roles.decorator';
import { ApiWhereJsonQuery, JsonQuery } from '../common/json-query.decorator';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionAfterRemoteInterceptor } from './subscription-after-remote.interceptor';
import { SubscriptionsQueryTransformPipe } from './subscriptions-query-transform.pipe';
import { SubscriptionsService } from './subscriptions.service';

// todo: apply SubscriptionsQueryTransformPipe for find, findOne, updateAll, deleteAll

@Controller('subscriptions')
@ApiTags('subscription')
@UseInterceptors(SubscriptionAfterRemoteInterceptor)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('count')
  @ApiWhereJsonQuery()
  @Roles(Role.SuperAdmin, Role.Admin, Role.AuthenticatedUser)
  async count(
    @Req() req,
    @JsonQuery('where', SubscriptionsQueryTransformPipe)
    where?: FilterQuery<Subscription>,
  ) {
    return this.subscriptionsService.count(where);
  }

  // @Post()
  // create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
  //   return this.subscriptionsService.create(createSubscriptionDto);
  // }

  @Get()
  findAll() {
    return this.subscriptionsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.subscriptionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  // ) {
  //   return this.subscriptionsService.update(+id, updateSubscriptionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.subscriptionsService.remove(+id);
  // }
}
